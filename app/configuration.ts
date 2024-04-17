export type Address = `0x${string}`;

const Configuration = {
  contracts: {
    Token: process.env.TOKEN! as Address,
    ConstantFlowAgreementV1: process.env
      .NEXT_PUBLIC_CONSTANT_FLOW_AGREEMENT as Address,
  },
};

export default Object.freeze(Configuration);
