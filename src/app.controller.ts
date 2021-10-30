import { Controller, Get, Post, Response, StreamableFile, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('file-upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @Post('files-upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }

  @Post('multiple-files-upload')
  @UseInterceptors(FileFieldsInterceptor([
    {name: 'file1', maxCount: 1},
    {name: 'file2', maxCount: 2}
  ]))
  uploadMultipleFiles(@UploadedFiles() files: {file1? : Express.Multer.File[], file2? : Express.Multer.File[]}) {
    console.log(files);
  }

  @Post('any-files-upload')
  @UseInterceptors(AnyFilesInterceptor())
  uploadAnyFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }

  @Get('stream-file')
  getFile(): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file);
  }

  @Get('stream-file-customize')
  getFileCustomizedResponse(@Response({ passthrough: true }) res): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="package.json'
    })
    return new StreamableFile(file);
  }
}
