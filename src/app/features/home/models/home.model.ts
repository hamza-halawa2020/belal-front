import { FeasibilityStudy } from '../../feasibility-studies/models/feasibility-study.model';
import { InvestmentOpportunity } from '../../investment-opportunities/models/investment-opportunity.model';
import { Service } from '../../services/models/service.model';
import { StaffMember } from '../../staff/models/staff-member.model';
import { SuccessPartner } from '../../success-partners/models/success-partner.model';
import { WorkSample } from '../../work-samples/models/work-sample.model';

export interface HomeStats {
    completedStudies: number;
    satisfiedClients: number;
    yearsExperience: number;
    successPartners: number;
}

export interface HomeData {
    stats: HomeStats;
    latestWorkSamples: WorkSample[];
    teamMembers: StaffMember[];
    testimonials: HomeTestimonial[];
    latestPosts: HomePost[];
    partners: HomePartner[];
}

export interface HomeApiListResponse<T> {
    data?: T[];
}

export interface HomeTestimonial {
    id: number;
    client_name: string;
    comment: string;
    status?: string;
    created_at?: string;
    rating?: number;
}

export interface HomeRawReview {
    id: number;
    name: string;
    review: string;
    status?: string;
    created_at?: string;
    rating?: number;
}

export interface HomePost {
    id: number;
    title: string;
    description?: string;
    excerpt?: string;
    content?: string;
    image?: string;
    image_url?: string;
    created_at?: string;
}

export type HomeSuccessPartner = SuccessPartner & {
    status?: string;
};

export interface HomePartner {
    id: number;
    name: string;
    logo_url?: string;
    link?: string | null;
    status?: string;
}

export type HomeFeaturedService = Service;
export type HomeFeaturedFeasibilityStudy = FeasibilityStudy;
export type HomeFeaturedInvestmentOpportunity = InvestmentOpportunity;
