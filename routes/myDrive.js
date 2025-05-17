const { Router } = require('express')
const router = Router()
const driveCtrl = require('../controllers/myDriveController')
const handler = require('../middlewares/handler')
const { body } = require('express-validator')
const { route } = require('.')

router.get('/my-drive', handler.isAuthMiddleware, driveCtrl.myDrive_get)
router.post('/my-drive/create', handler.isAuthMiddleware, driveCtrl.myDrive_create_post)

router.post('/my-drive/create-folder', [
    body('folderName').trim()
        .notEmpty().withMessage('Folder Name is Mandatory')
], handler.isAuthMiddleware, driveCtrl.createFolder_post)

router.get('/my-drive/folders/:folderId', handler.isAuthMiddleware, driveCtrl.myDrive_folders_get)

//DELETE
router.post('/my-drive/delete-folder/:folderId', handler.isAuthMiddleware, driveCtrl.delete_folder_post)
router.post('/my-drive/delete-file/:fileId', handler.isAuthMiddleware, driveCtrl.delete_file_post)

//EDIT
router.post('/my-drive/rename-folder/:folderId', handler.isAuthMiddleware, driveCtrl.rename_folder_post)

//DOWNLOAD
router.post('/my-drive/download/:fileName', driveCtrl.download_file_post)

//SHARE
router.post('/my-drive/folder/:folderId/share', handler.isAuthMiddleware, driveCtrl.share_folder_post)
router.get('/shared-folder/:token', driveCtrl.share_folder_get)

module.exports = router