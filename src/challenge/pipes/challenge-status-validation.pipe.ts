import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge.status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        ChallengeStatus.ACEITO,
        ChallengeStatus.NEGADO,
        ChallengeStatus.CANCELADO
    ];

    transform(value: any) {
        const status = value.status.toUpperCase();

        if (!this.isValidStatus(status)) {
            throw new BadRequestException(`${status} é um status inválido`);
        }

        return value;
    }

    private isValidStatus(status: any) {
        const idx = this.allowedStatuses.indexOf(status);
        // -1 se o elemento não for encontrado
        return idx !== -1;
    }
}
