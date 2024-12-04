export interface IProposalDTO {
  responseTime?: number;
  expectedPrice?: number;
  predict?: string;
}

export class ProposalDTO implements IProposalDTO {
  constructor(
    public responseTime?: number,
    public expectedPrice?: number,
    public predict?: string
  ) {}
}
