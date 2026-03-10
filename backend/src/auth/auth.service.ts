import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto, ResetPasswordDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private mapUser(supabaseUser: any) {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      roleId: supabaseUser.app_metadata?.roleId ?? 3,
    };
  }

  async login(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({ email, password });

    if (error || !data?.session) {
      throw new UnauthorizedException(error?.message ?? 'Invalid credentials');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: this.mapUser(data.user),
    };
  }

  async register(dto: RegisterDto): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.admin.createUser({
        email: dto.email,
        password: dto.password,
        email_confirm: true,
        app_metadata: { roleId: 3 },
      });

    if (error) {
      throw new HttpException(error.message, 400);
    }

    // Sign in immediately after registration to get tokens
    const { data: sessionData, error: signInError } =
      await this.supabaseService
        .getClient()
        .auth.signInWithPassword({ email: dto.email, password: dto.password });

    if (signInError || !sessionData?.session) {
      throw new HttpException(
        signInError?.message ?? 'Registration succeeded but sign-in failed',
        400,
      );
    }

    return {
      accessToken: sessionData.session.access_token,
      refreshToken: sessionData.session.refresh_token,
      user: this.mapUser(data.user),
    };
  }

  async refreshToken(refreshTok: string): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.refreshSession({ refresh_token: refreshTok });

    if (error || !data?.session) {
      throw new UnauthorizedException(
        error?.message ?? 'Invalid refresh token',
      );
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: this.mapUser(data.user),
    };
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    const { error } = await this.supabaseService
      .getClient()
      .auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
      });

    if (error) {
      return false;
    }
    return true;
  }

  async resetPassword(dto: ResetPasswordDto): Promise<boolean> {
    // The resetPasswordToken here is the Supabase access token obtained
    // from the magic link redirect. Use it to update the password.
    const { data: userData, error: userError } = await this.supabaseService
      .getClient()
      .auth.getUser(dto.resetPasswordToken);

    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const { error } = await this.supabaseService
      .getClient()
      .auth.admin.updateUserById(userData.user.id, {
        password: dto.newPassword,
      });

    if (error) {
      throw new HttpException(error.message, 400);
    }

    return true;
  }

  async getAuthUser(token: string): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.getUser(token);

    if (error || !data?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return {
      accessToken: token,
      user: this.mapUser(data.user),
    };
  }
}
