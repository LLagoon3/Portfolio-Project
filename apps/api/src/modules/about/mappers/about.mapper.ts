import { AboutProfile } from '../entities/about-profile.entity';
import { AboutResponseDto } from '../dto/about-response.dto';

const bySortOrder = <T extends { sortOrder: number }>(a: T, b: T): number =>
  a.sortOrder - b.sortOrder;

export function toAboutResponseDto(profile: AboutProfile): AboutResponseDto {
  const sortedBios = [...(profile.bios ?? [])].sort(bySortOrder);
  const sortedStats = [...(profile.stats ?? [])].sort(bySortOrder);
  const sortedPrinciples = [...(profile.principles ?? [])].sort(bySortOrder);
  const sortedJourneys = [...(profile.journeys ?? [])].sort(bySortOrder);
  const sortedSocials = [...(profile.socials ?? [])].sort(bySortOrder);
  const sortedFaqs = [...(profile.faqs ?? [])].sort(bySortOrder);

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
    socials: sortedSocials.map((s) => ({ label: s.label, url: s.url })),
    faqs: sortedFaqs.map((f) => ({ question: f.question, answer: f.answer })),
  };
}
