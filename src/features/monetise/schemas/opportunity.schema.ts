import { nanoid } from "nanoid";

class OpportunitySchema implements StaticSchema<Opportunity> {
  getId(): keyof Opportunity {
    return "_id";
  }

  createEntityFromParams(params: Partial<Opportunity>): Opportunity {
    const id = nanoid();

    return {
      _id: id,
      title: "",
      brandName: "",
      type: "sponsorship",
      category: "lifestyle",
      description: "",
      deliverables: [],
      compensation: "",
      compensationType: "fixed",
      eligibility: {
        minFollowers: 0,
        niches: [],
        platforms: [],
        countries: [],
      },
      deadline: new Date().toISOString(),
      requiresApplication: false,
      termsAndConditions: "",
      status: "active",
      createdBy: "",
      maxParticipants: 0,
      currentParticipants: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...params,
    };
  }
}

export const opportunitySchema = new OpportunitySchema();

class CreatorOpportunitySchema implements StaticSchema<CreatorOpportunity> {
  getId(): keyof CreatorOpportunity {
    return "_id";
  }

  createEntityFromParams(
    params: Partial<CreatorOpportunity>,
  ): CreatorOpportunity {
    const id = nanoid();

    return {
      _id: id,
      creatorId: "",
      opportunityId: "",
      status: "accepted",
      appliedAt: new Date().toISOString(),
      resubmitCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...params,
    };
  }
}

export const creatorOpportunitySchema = new CreatorOpportunitySchema();
