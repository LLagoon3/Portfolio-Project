import { AboutProfile } from '../entities/about-profile.entity';
import { AboutResponseDto } from '../dto/about-response.dto';

export function toAboutResponseDto(profile: AboutProfile): AboutResponseDto {
  const sortedBios = [...(profile.bios ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  const sortedStats = [...(profile.stats ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  const sortedPrinciples = [...(profile.principles ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  const sortedJourneys = [...(profile.journeys ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  return {
    name: profile.name,
    tagline: profile.tagline,
    profileImage: profile.profileImage,
    bio: sortedBios.map((b) => b.paragraph),
    address: profile.address ?? null,
    email: profile.email ?? null,
    phone: profile.phone ?? null,
    availability: profile.availability ?? null,
    stats: sortedStats.map((s) => ({
      label: s.label,
      value: s.value,
      sub: s.sub ?? null,
    })),
    principles: sortedPrinciples.map((p) => ({
      title: p.title,
      body: p.body,
    })),
    journey: sortedJourneys.map((j) => ({
      year: j.year,
      title: j.title,
      role: j.role ?? null,
      body: j.body,
    })),
    stacks: profile.stacks ?? [],
  };
}
