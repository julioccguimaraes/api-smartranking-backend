import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class ValidationParamPipe implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException("O valor do parametro " + metadata.data +  " não pode ser vazio")
        }

        return value
    }
}