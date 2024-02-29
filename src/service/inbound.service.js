import { prismaClient } from "../app/db.js";
import { responseError } from "../error/response.error.js";
import { inboundIdValidation, inboundValidation, updateInboundValidation } from "../validation/inbound.validation.js"
import { validate } from "../validation/validation.js"
import companyService from "./company.service.js";
import { getId } from "./genereateId.service.js";
import { getUTCTime } from "./time.service.js";
import userService from "./user.service.js";
import warehouseService from "./warehouse.service.js";

const create = async (userLogin, data) => {
    const validationResult = validate(inboundValidation, data);

    const user = await userService.detail(userLogin, userLogin.userId, false);

    // validasi sementara jika user companyId tidak ada akan error
    if(!user.companyId) throw new responseError(404, "Anda BackUser");

    const isWarehouseExist = await warehouseService.detail(userLogin, validationResult.warehouseId, false);

    const company = await companyService.detail(userLogin, user.companyId, false);

    const T = new Date().toISOString().slice(11,16).replace(":", "");
    const D = new Date().toISOString().slice(0, 10).replaceAll("-","");
    


    if(validationResult.details.length < 1) throw new responseError(403, "Details harus diisi!");
    let totalProduct = validationResult.details.length;
    let totalQuantity = 0;
    for(let i =0; i < validationResult.details.length; i++){
        const product = await prismaClient.products.findFirst({
            where: {
                sku: validationResult.details[i].sku,
            }
        })

        if(!product) throw new  Error(`Product dengan sku : ${validationResult.details[i].sku} tidak ditemukan!`)
        if (product.companyId !== user.companyId) throw new responseError(403, `Product dengan sku : ${validationResult.details[i].sku} tidak ditemukan di company ${company.companyName}`);
        totalQuantity += validationResult.details[i].quantity;
    }


    //rumus inbound code : companyCode + waktu + tanggal
    const inbound = await prismaClient.inbounds.create({
        data: {
           inboundId: getId(),
           companyId: user.companyId, 
           warehouseId: validationResult.warehouseId,
           inboundCode: company.companyCode+"-"+T+"-"+D,
           description: validationResult.description ?? null,
           totalQuantity,
           totalProduct,
           createdAt: getUTCTime(),
           updatedAt: getUTCTime(),
        }
    });

    //time
    const currentTime = new Date();
    const transactionDate = new Date(validationResult.transactionDate);
    transactionDate.setHours(currentTime.getHours());
    transactionDate.setMinutes(currentTime.getMinutes());
    transactionDate.setSeconds(currentTime.getSeconds());
    transactionDate.setMilliseconds(currentTime.getMilliseconds());
    const temp = new Date(transactionDate).setDate(transactionDate.getDate() + 10);
    const dueDate = new Date(temp);

    const inboundDate = await prismaClient.inbound_dates.create({
        data: {
            inboundDateId: getId(),
            inboundId: inbound.inboundId,
            transactionDate,
            dueDate,
            approvedDate: null,
        }
    })

    //status
    if(!validationResult.status) validationResult.status = "pending";
    const inboundStatus = await prismaClient.inbound_trx_logs.create({
        data: {
            inboundTrxLogId: getId(),
            inboundId: inbound.inboundId,
            send: validationResult.status === "send" ? validationResult.status : null,
            pending: validationResult.status === "pending" ? validationResult.status : null,
            received: validationResult.status === "received" ? validationResult.status : null,
            allocated: validationResult.status === "allocated" ? validationResult.status : null,
            done: validationResult.status === "done" ? validationResult.status : null,
            cancelled: validationResult.status === "cancelled" ? validationResult.status : null,
        }
    })


    //detail
    for(let i =0; i < validationResult.details.length; i++){
        const product = await prismaClient.products.findFirst({
            where: {
                sku: validationResult.details[i].sku,
            }
        })
        const inboundDetail = await prismaClient.inbound_details.create({
            data: {
                inboundDetailId: getId(),
                inboundId: inbound.inboundId,
                productId: product.productId,
                quantity: validationResult.details[i].quantity,
            }
        })
    };

    return {
        inboundId: inbound.inboundId,
        companyId: inbound.companyId,
        warehouseId: inbound.warehouseId,
        transactionDate: inboundDate.transactionDate,
        dueDate: inboundDate.dueDate,
        approvedDate: inboundDate.approvedDate,
        inboundCode: inbound.inboundCode,
        description: inbound.description,
        status: validationResult.status,
        details: validationResult.details,
    };
}

const list = async (userLogin) => {
    const result = await prismaClient.inbounds.findMany({
        select: {
            inboundId: true,
            companyId: true,
            warehouseId: true,
            inbound_dates: {
                select: {
                    transactionDate: true,
                    dueDate: true,
                    approvedDate: true,
                }
            },
            inboundCode: true,
            description: true,
            inbound_trx_logs: true,
            inbound_details: {
                select: {
                    productId: true,
                    quantity: true,
                }
            } 
        }
    });
    if(result.length < 1) throw new responseError(404, "List inbounds kosong!");
    const data = [];
    for(let i = 0; i < result.length; i++) {

        const status = (result[i].inbound_trx_logs[0].allocated) ? "allocated" : (result[i].inbound_trx_logs[0].cancelled) ? "cancelled" : (result[i].inbound_trx_logs[0].done) ? "done" : (result[i].inbound_trx_logs[0].pending) ? "pending" : (result[i].inbound_trx_logs[0].received) ? "received" : "send";

        const products = [];
        for(let y = 0; y < result[i].inbound_details.length; y++){
            const product = await prismaClient.products.findFirst({
                where: {
                    productId: result[i].inbound_details[y].productId,
                }
            })

            products.push({
                sku: product.sku,
                quantity: result[i].inbound_details[y].quantity,
            })

        }

        const end = {
            inboundId: result[i].inboundId,
            companyId: result[i].companyId,
            warehouseId: result[i].warehouseId,
            transactionDate: result[i].inbound_dates[0].transactionDate,
            dueDate: result[i].inbound_dates[0].dueDate,
            approvedDate: result[i].inbound_dates[0].approvedDate,
            inboundCode: result[i].inboundCode,
            description: result[i].description,
            status,
            detail: products,
        }

        data.push(end);

    }


    return data;
}

const detail = async (userLogin, inboundId ) => {
    const validationResult = validate(inboundIdValidation, { inboundId, } )

    const inbound = await prismaClient.inbounds.findFirst({
        where: {
            inboundId,
        },
        select: {
            inboundId: true,
            companyId: true,
            warehouseId: true,
            inbound_dates: {
                select: {
                    transactionDate: true,
                    dueDate: true,
                    approvedDate: true,
                }
            },
            inboundCode: true,
            description: true,
            inbound_trx_logs: true,
            inbound_details: {
                select: {
                    productId: true,
                    quantity: true,
                }
            } 
        }
    })

    if(!inbound) throw new responseError(404, "Inbound tidak ditemukan!");

    let result;
    const status = (inbound.inbound_trx_logs[0].allocated) ? "allocated" : (inbound.inbound_trx_logs[0].cancelled) ? "cancelled" : (inbound.inbound_trx_logs[0].done) ? "done" : (inbound.inbound_trx_logs[0].pending) ? "pending" : (inbound.inbound_trx_logs[0].received) ? "received" : "send";

    const products = [];
    for(let y = 0; y < inbound.inbound_details.length; y++){
        const product = await prismaClient.products.findFirst({
            where: {
                productId: inbound.inbound_details[y].productId,
            }
        })

        products.push({
            sku: product.sku,
            quantity: inbound.inbound_details[y].quantity,
        })

    }

    result = {
        inboundId: inbound.inboundId,
        companyId: inbound.companyId,
        warehouseId: inbound.warehouseId,
        transactionDate: inbound.inbound_dates[0].transactionDate,
        dueDate: inbound.inbound_dates[0].dueDate,
        approvedDate: inbound.inbound_dates[0].approvedDate,
        inboundCode: inbound.inboundCode,
        description: inbound.description,
        status,
        detail: products,
    }


    return result;
}

//update dan delete masih work in proggress

const update = async (userLogin, data) => {
    const validationResult = validate(updateInboundValidation, data);

    const inboundCheck = await prismaClient.inbounds.findFirst({
        where: {
            inboundId: validationResult.inboundId,
        }
    })

    if(!inboundCheck) throw new responseError(404, "Inbound tidak ditemukan!");

    //check inbound status pending atau yang lain
    if(inboundCheck.status !== "pending") throw new responseError(403, `Inbound status ${inboundCheck.status}`)

    const newData = {};
    if(validationResult.warehouseId) {
        const warehouse = await warehouseService.detail(userLogin, validationResult.warehouseId, false);
        newData.warehouseId = validationResult.warehouseId;
    }

    //jika sku ada 
    if(validationResult.sku){
            const product = await prismaClient.products.findFirst({
                where: {
                    AND: [
                        {
                            sku: validationResult.sku,
                        },
                        {
                            companyId: inboundCheck.companyId,
                        }
                    ]
                }
            });
        if(!product) throw new responseError(404, "Product tidak ditemukan!")

        newData.sku = validationResult.sku;
        newData.inboundCode = inboundCheck.inboundCode.replace(inboundCheck.sku, validationResult.sku);
    }

    if(validationResult.description) newData.description = validationResult.description;

    if(validationResult.quantity) newData.quantity = validationResult.quantity;

    //handle kondisi jika request status = done
    if(validationResult.status) newData.status = validationResult.status;

    const result = await prismaClient.inbounds.update({
        where: {
            inboundId: validationResult.inboundId
        },
        data: newData,
    })

    return result;
}

const deleteInbound = async (userLogin, data) => {
    const validationResult = validate(inboundIdValidation, data);

    const inbound = await prismaClient.inbounds.findFirst({
        where: {
            inboundId: validationResult.inboundId,
        }
    })

    if(!inbound) throw new responseError(404, "Inbound tidak ditemukan!")

    //delete inbound_trx_logs
    await prismaClient.inbound_trx_logs.delete({
        where: {
            inboundId: validationResult.inboundId,
        }
    })

    //delete inbound detail
    await prismaClient.inbound_details.delete({
        where: {
            inboundId: validationResult.inboundId,
        }
    })

    //delete inbound dates
    await prismaClient.inbound_dates.delete({
        where: {
            inboundId: validationResult.inboundId,
        }
    })

    //delete inbound
    await prismaClient.inbounds.delete({
      where: {
        inboundId: validationResult.inboundId,
      },
    }); 

    return {
        "message": "Delete success!"
    }
}

export default {
    create,
    list,
    detail,
    update,
    deleteInbound,
}