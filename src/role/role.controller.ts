import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';


@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRoleDto: CreateRoleDto, ) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
