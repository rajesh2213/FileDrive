const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()

const insert_file_metaData = async (fileList) => {
    try {
        const data = fileList.map(file => ({
            name: file.name,
            size: file.size,
            url: file.url,
            userId: file.userId,
            folderId: parseInt(file.folderId) || null,
        }));
        const insertFile = await prisma.file.createMany({ data, skipDuplicates: false, })
        console.log(`file inserted: ${insertFile}`)
        return insertFile
    } catch (err) {
        console.log(`Error inserting file in DB ${err}`)
    }
}

const getFolders = async (parentFolderId) => {
    try{
        const folders = await prisma.folder.findMany({
            where: {parentId: parseInt(parentFolderId) || null},
            orderBy: {name: 'desc'}
        })
        return folders
    }catch(err){
        throw new Error(err)
    }
}

const getAllFiles = async (folderId) => {
    try {
        const rows = await prisma.file.findMany({
            where: { folderId: parseInt(folderId) || null},
            orderBy: {name: 'desc'}
        })
        return rows
    }catch (err) {
        throw new Error(err)
    }
}

const getParentFolderId = async (folderId) => {
    try{
        const folder = await prisma.folder.findUnique({
            where: { id: parseInt(folderId)},
            select: { parentId: true}
        })
        return folder.parentId || null
    }catch(err){
        console.log(`Error getting parent folder ID: ${err}`)
    }
}


const createFolder = async (name, userId, parentFolderId) => {
    try{
        const newFolder = await prisma.folder.create({
            data: {
                name: name,
                userId: userId,
                parentId: parseInt(parentFolderId) || null
            }
        })
        return newFolder
    }catch(err){
        throw new Error(err)
    }
}

//DELETE:

const deleteFolder = async (folderId) => {
    try{
        const deletedFolder = await prisma.folder.delete({
            where: { id: folderId }
        })
        return deletedFolder
    }catch(err){
        throw new Error(err)
    }
}

const deleteFile = async (fileId) => {
    try{
        const deletedFile = await prisma.file.delete({
            where: { id: fileId }
        })
        return deletedFile
    }catch(err){
        throw new Error(err)
    }
}

const renameFolder = async (folderId, newName) => {
    try{
        const updatedFolder = await prisma.folder.update({
            where: {id: parseInt(folderId)},
            data: {
                name: newName
            }
        })
        return updatedFolder
    }catch(err){
        throw new Error(err)
    }
}

const insertShareFolderLink = async (folderId, token, expiresAt) => {
    try{
        const row = await prisma.shareFolderLink.create({
            data: {
                token,
                folderId: parseInt(folderId),
                expiresAt
            }
        })
        console.log(`Share folder link inserted: ${row}`)
        return row
    }catch(err){
        console.log(`Error inserting share folder link: ${err}`)
        throw new Error(err)
    }    
}

const getFolderIdByToken = async (token) => {
    try{
        const folderId = await prisma.shareFolderLink.findUnique({
            where: {token},
            select: {
                folderId: true
            }
        })
        if(!folderId){
            throw new Error('No Filder Id found for this token')
        }
        return folderId || null
    }catch(err){
        throw new Error(err)
    }
}


module.exports = {
    insert_file_metaData,
    getAllFiles,
    getFolders,
    getParentFolderId,
    createFolder,
    deleteFolder,
    deleteFile,
    renameFolder,
    insertShareFolderLink,
    getFolderIdByToken
}