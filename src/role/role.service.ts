import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './entities/role.entity';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    createRoleDto.name = createRoleDto.name.toLocaleLowerCase();

    try {
      const role = await this.roleModel.create(createRoleDto);
      return role;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll() {
    try {
      return await this.roleModel.find().exec();
    } catch (error) {
      this.handleException(error);
    }
  }

  async findOne(id: string) {
    try {
      return this.findRole(id);
    } catch (error) {
      this.handleException(error);
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.findRole(id); 

      role.name = updateRoleDto.name || role.name;
      role.description = updateRoleDto.name || role.description;

      return await role.save();
    } catch (error) {
      this.handleException(error);
    }
  }

  // Eliminacion fisico de un rol 
  async remove(id: string) {
    try {      
      const role = await this.findRole(id);

      return await this.roleModel.findOneAndDelete({ name: role.name }).exec();
    } catch (error) {
      this.handleException(error);
    }
  }

  // Eliminacion logico de un rol
  async softDelete(id: string){
    try {
      const role = await this.findRole(id);

      role.deleteAt = new Date();

      return await role.save();
    } catch (error) {
      this.handleException(error);
    }
  }

  // Buscar un rol especifico
  private async findRole(id: string){
    let role: Role;

      if (isValidObjectId(id)) {
        role = await this.roleModel.findById(id);
      }
      if (!role) {
        role = await this.roleModel.findOne({ name: id.toLowerCase().trim() });
      }
      if (!role) {
        throw new NotFoundException(`Role ${id} not found`);
      }

      return role;
  }

  //Manejo de Error Global:
  private handleException(error: any): never {
    if (error.code === 11000) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Pokemon already exists',
        details: error.keyValue,
      });
    }

    if (error instanceof BadRequestException) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid data',
        details: error.message,
      });
    }

    throw new InternalServerErrorException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unexpected error occurred',
      details: error.message,
    });
  }
}
