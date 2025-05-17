const upload = require('../middlewares/multer')
const myDriverModel = require('../models/myDriveModel')
const { validationResult } = require('express-validator')
const cloudinary = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');

async function renderMyDriveView(res, folderId){
    try {
        const files = await myDriverModel.getAllFiles(parseInt(folderId))
        const folders = await myDriverModel.getFolders(parseInt(folderId))
        res.render('my-drive', { files: files || null, folders: folders || null })
    } catch (err) {
        console.log(`Error fetching all the files and folders in myDrive_folders_get:  ${err}`)
        req.flash('errors', err.message || 'Upload failed');
        res.render('my-drive', { files: null, folders: null });
    }
}

const myDrive_get = async (req, res) => {
    try {
        const files = await myDriverModel.getAllFiles()
        const folders = await myDriverModel.getFolders()
        res.render('my-drive', { files: files || null, folders: folders || null })
    } catch (err) {
        console.log(`Error fetching all the files and folders in myDrive_get:  ${err}`)
        req.flash('errors', err.message || 'Upload failed');
        res.render('my-drive', { files: null, folders: null });
    }
}

const myDrive_folders_get = async (req, res) => {
    const parentFolderId = req.params.folderId
    await renderMyDriveView(res, parentFolderId)
}

const myDrive_create_post = (req, res) => {
    upload.array('files', 5)(req, res, async function (err) {
        try {
            const parentFolderId = req.body.parentFolderId || null
            const redirectTo = parentFolderId
                ? `/my-drive/folders/${parentFolderId}`
                : '/my-drive';
            if (err) {
                console.log(err.message)
                req.flash('errors', err.message || 'Upload failed');
                return res.redirect(redirectTo)
            }
            if (!req.files) {
                req.flash('errors', 'No files uploaded');
                return res.redirect(redirectTo)
            }
            const uploadedFiles = (req.files).map(file =>
            ({
                name: file.originalname,
                size: file.size,
                url: file.path,
                userId: req.user.id,
                folderId: parentFolderId
            })
            )
            const insertedFiles = await myDriverModel.insert_file_metaData(uploadedFiles)
            console.log(`${insertedFiles.count} files inserted successfully.`);
            res.redirect(redirectTo)
        } catch (err) {
            console.log(`Error Uploading ${err}`)
            req.flash('errors', 'File uploaded but failed to save metadata');
            res.redirect(redirectTo)
        }
    })
}

const createFolder_post = async (req, res) => {
    const errors = validationResult(req)
    const { folderName, parentFolderId } = req.body
    const redirectTo = parentFolderId
        ? `/my-drive/folders/${parentFolderId}`
        : '/my-drive';
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array()[0].msg)
        return res.redirect(redirectTo)
    }
    try {
        const newFolder = await myDriverModel.createFolder(folderName, req.user.id, parentFolderId)
        console.log(`Sucessfully Created Folder: ${newFolder.name}`)
        res.redirect(redirectTo)
    } catch (err) {
        console.log(`Error Creating Folder: ${err}`)
        req.flash('errors', err.message)
        res.redirect(redirectTo)
    }
}


//DELETE

const delete_folder_post = async (req, res) => {
    try{
        const folderId = req.params.folderId
        const deletedFolder = await myDriverModel.deleteFolder(parseInt(folderId))
        const parentFolderId = deletedFolder.parentId || null
        const redirectTo = parentFolderId
            ? `/my-drive/folders/${parentFolderId}`
            : '/my-drive'
        console.log(`${deletedFolder.name} folder successfully deleted`)
        res.redirect(redirectTo)
    }catch(err){
        console.log(`Error Deleting Folder: ${err}`)
        req.flash('errors', err.message)
        res.redirect('/my-drive')
    }
}

const delete_file_post = async (req, res) => {
    try{
        const fileId = req.params.fileId
        const deletedFile = await myDriverModel.deleteFile(parseInt(fileId))
        const fileUrlSplit = deletedFile.url.split('/')
        const filePublicId = fileUrlSplit[fileUrlSplit.indexOf('myDrive')]+'/'+fileUrlSplit[fileUrlSplit.indexOf('myDrive')+1].split('.')[0]
        await cloudinary.uploader.destroy(filePublicId)
        const parentFolderId = deletedFile.folderId || null
        const redirectTo = parentFolderId
            ? `/my-drive/folders/${parentFolderId}`
            : '/my-drive'
        console.log(`${deletedFile.name} file successfully deleted`)
        res.redirect(redirectTo)
    }catch(err){
        console.log(`Error Deleting Folder: ${err}`)
        req.flash('errors', err.message)
        res.redirect('/my-drive')
    }
}

//EDIT

const rename_folder_post = async (req, res) => {
    try{
        const folderId = req.params.folderId
        const { oldName, newName } =req.body
        const parentFolderId = await myDriverModel.getParentFolderId(folderId)
        const redirectTo = parentFolderId
            ? `/my-drive/folders/${parentFolderId}`
            : '/my-drive'
        if(oldName !== newName){
            const updatedFolder = await myDriverModel.renameFolder(folderId, newName)           
        }
        res.redirect(redirectTo)
    }catch(err){
        req.flash('errors', err.message)
        res.redirect(redirectTo)
    }
}

//DOWNLOAD
const download_file_post = (req, res) => {
    const fileName= req.params.fileName
    const filePath = req.query.path
    /*
    Config for local storage::
    res.download(filePath, fileName, (err) => {
        if(err){
            console.log(`Error downloading file: ${err}`)
            req.flash('errors', err.message)
            res.redirect('/my-drive')
        }
    })
    */
    const fileUrlSplit = filePath.split('/upload/')
    const fileDownloadUrl = `${fileUrlSplit[0]}/upload/fl_attachment:${fileName.split('.')[0]}/${fileUrlSplit[1]}`;
    res.redirect(fileDownloadUrl)
}

//SHARE:
const share_folder_post = async (req, res) => {
    const folderId = req.params.folderId
    const expiresInDays = req.body.expiresInDays
    const token = uuidv4()
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    try{
        const row = await myDriverModel.insertShareFolderLink(folderId, token, expiresAt)
        const shareLink = `${req.protocol}://${req.host}/shared-folder/${token}`
        const expiresAtDate = row.expiresAt.toISOString().split('T')[0]
        res.json({success: true, shareLink, expiresAtDate})
    }catch(err){
        console.log(`Error Sharing Folder: ${err}`)
        req.flash('errors', err.message)
        res.redirect('/my-drive')
    }
}

const share_folder_get = async (req, res) => {
    const token = req.params.token
    try{
        const folderId = (await myDriverModel.getFolderIdByToken(token)).folderId
        if(!folderId){
            req.flash('errors', 'Invalid or expired link')
            return res.redirect('/my-drive')
        }
        await renderMyDriveView(res, folderId)
    }catch(err){
        console.log(`Error Sharing Folder: ${err}`)
        req.flash('errors', err.message)
        res.redirect('/my-drive')
    }
}

module.exports = {
    myDrive_get,
    myDrive_create_post,
    createFolder_post,
    myDrive_folders_get,
    delete_folder_post,
    delete_file_post,
    rename_folder_post,
    download_file_post,
    share_folder_post,
    share_folder_get
}