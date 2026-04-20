import { AboutProfile } from '../entities/about-profile.entity';
import { AboutResponseDto } from '../dto/about-response.dto';

export function toAboutResponseDto(profile: AboutProfile): AboutResponseDto {
  const sortedBios = [...(profile.bios ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  return {
    name: profile.name,
    tagline: profile.tagline,
    profileImage: profile.profileImage,
    bio: sortedBios.map((b) => b.paragraph),
  };
}
