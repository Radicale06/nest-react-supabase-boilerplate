import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  ResetPasswordDto,
  ResetPasswordReqDto,
} from './dto/login.dto';
import { ResponseDto } from '../utils/response.dto';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { AuthUserJWT } from '../utils/auth-user-jwt.decorator';
import { AuthResponseDto } from './dto/auth-resp.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ description: 'Login response', type: AuthResponseDto })
  login(@Body() { email, password }: LoginDto): Promise<ResponseDto> {
    return this.authService.login(email, password);
  }

  @Post('register')
  @ApiOkResponse({ description: 'Register response', type: AuthResponseDto })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('refresh-token')
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @ApiOkResponse({ description: 'Refresh token response', type: AuthResponseDto })
  refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('request-reset-password-email')
  @ApiOkResponse({ description: 'Request reset password' })
  requestPasswordReset(@Body() { email }: ResetPasswordReqDto): Promise<boolean> {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  @ApiOkResponse({ description: 'Reset password' })
  resetPassword(@Body() dto: ResetPasswordDto): Promise<boolean> {
    return this.authService.resetPassword(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @ApiOkResponse({ description: 'Get authenticated user', type: AuthResponseDto })
  getAuthenticatedUser(@AuthUserJWT() jwt: string): Promise<any> {
    return this.authService.getAuthUser(jwt);
  }
}
