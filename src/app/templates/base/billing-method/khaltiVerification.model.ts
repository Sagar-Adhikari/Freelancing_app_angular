export class KhaltiVerification {
  constructor(
    public amount: number,
    public token: string,
    public payload_idx: string,
    public mobile: string,
    public product_identity: string,
    public productName: string,
    public widget_id: string,
    // public email: string,
    public client_id: string,
    public freelancer_id: string
  ) {}
}
