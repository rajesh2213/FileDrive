-- CreateTable
CREATE TABLE "share_folder_links" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "folder_id" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "share_folder_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "share_folder_links_token_key" ON "share_folder_links"("token");

-- AddForeignKey
ALTER TABLE "share_folder_links" ADD CONSTRAINT "share_folder_links_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
