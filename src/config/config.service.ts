import { Injectable } from '@nestjs/common';
import { ConfigService, Path, PathValue } from '@nestjs/config';
import { AllConfigs } from './interfaces/all-configs.interface';

// Custom config service to override basic methods (if needed)
@Injectable()
export class MyConfigService extends ConfigService<AllConfigs, true> {
  /**
   * Overrides the get method to ensure strict type inference
   * based on the specific property path provided.
   */
  override get<P extends Path<AllConfigs>>(
    propertyPath: P,
  ): PathValue<AllConfigs, P> {
    return super.get(propertyPath, { infer: true });
  }
}
