import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}

export class ReviewModerationDto {
  @IsBoolean()
  isApproved: boolean;
} 