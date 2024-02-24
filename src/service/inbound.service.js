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

    // validasi sementara jika user code tidak ada akan error
    if(!user.companyId) throw new responseError(404, "Anda BackUser");

    const isWarehouseExist = await warehouseService.detail(userLogin, validationResult.warehouseId, false);

    if(!isWarehouseExist) throw new responseError(404, "Warehouse tidak ditemukan!");

    const isProductExist = await prismaClient.products.findFirst({
        where: {
            sku: validationResult.sku,
        },
    });

    const company = await companyService.detail(userLogin, user.companyId, false);

    if (!isProductExist) throw new responseError(404, "Product tidak ditemukan!");
    if (isProductExist.companyId !== user.companyId) throw new responseError(403, `Product tidak ada di company ${(await company).companyName}`);

    if(validationResult.quantity <= 0) throw new responseError(403, `Quantity harus lebih dari ${validationResult.quantity}!`);

    const T = new Date().toISOString().slice(11,16).replace(":", "");
    const D = new Date().toISOString().slice(0, 10).replaceAll("-","");
    
    const date = getUTCTime();
    date.setDate(date.getDate() + 10)

    //rumus inbound code : skuProduct + waktu + tanggal
    const inbound = await prismaClient.inbounds.create({
        data: {
           inboundId: getId(),
           companyId: user.companyId, 
           warehouseId: validationResult.warehouseId,
           transactionDate: getUTCTime(),
           dueDate: date,
           approvedDate: null,
           inboundCode: validationResult.sku+"-"+T+"-"+D,
           description: validationResult.description ?? null,
           status: validationResult.status ?? "pending",
           sku: validationResult.sku,
           quantity: validationResult.quantity,
        }
    });

    return inbound;
}

const list = async (userLogin) => {
    const result = await prismaClient.inbounds.findMany();
    if(result.length < 1) throw new responseError(404, "List inbounds kosong!");
    return result;
}

const detail = async (userLogin, inboundId ) => {
    const validationResult = validate(inboundIdValidation, { inboundId, } )

    const inbound = await prismaClient.inbounds.findFirst({
        where: {
            inboundId,
        }
    })

    if(!inbound) throw new responseError(404, "Inbound tidak ditemukan!");

    return inbound;
}

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

    //jika sku ada (work in proggress)

    if(validationResult.description) newData.description = validationResult.description;

    if(validationResult.quantity) newData.quantity = validationResult.quantity;

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
    const result = await prismaClient.inbounds.delete({
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