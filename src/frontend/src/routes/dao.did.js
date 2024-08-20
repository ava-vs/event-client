// @ts-ignore
export const idlFactory = ({ IDL }) => {
  const AddMemberResult = IDL.Variant({
    'ok': IDL.Null,
    'otherError': IDL.Text,
    'notAuthorized': IDL.Null,
    'alreadyExists': IDL.Null,
  });
  const ProposalContent = IDL.Variant({
    'other': IDL.Record({ 'action': IDL.Text, 'description': IDL.Text }),
    'codeUpdate': IDL.Record({
      'description': IDL.Text,
      'wasmModule': IDL.Vec(IDL.Nat8),
    }),
    'adjustParameters': IDL.Record({
      'parameterName': IDL.Text,
      'newValue': IDL.Text,
      'description': IDL.Text,
    }),
    'transferFunds': IDL.Record({
      'recipient': IDL.Principal,
      'amount': IDL.Nat,
      'purpose': IDL.Variant({
        'serviceBill': IDL.Text,
        'toFund': IDL.Text,
        'grantPayment': IDL.Text,
      }),
    }),
  });
  const CreateProposalError = IDL.Variant({
    'notAuthorized': IDL.Null,
    'invalid': IDL.Vec(IDL.Text),
  });
  const Result_3 = IDL.Variant({ 'ok': IDL.Nat, 'err': CreateProposalError });
  const Result_1 = IDL.Variant({ 'ok': IDL.Null, 'err': IDL.Text });
  const Member = IDL.Record({ 'id': IDL.Principal, 'votingPower': IDL.Nat });
  const Vote = IDL.Record({
    'value': IDL.Opt(IDL.Bool),
    'votingPower': IDL.Nat,
  });
  const Time = IDL.Int;
  const ProposalStatusLogEntry = IDL.Variant({
    'failedToExecute': IDL.Record({ 'time': Time, 'error': IDL.Text }),
    'rejected': IDL.Record({ 'time': Time }),
    'executing': IDL.Record({ 'time': Time }),
    'executed': IDL.Record({ 'time': Time }),
  });
  const Proposal = IDL.Record({
    'id': IDL.Nat,
    'content': ProposalContent,
    'timeStart': IDL.Int,
    'votes': IDL.Vec(IDL.Tuple(IDL.Principal, Vote)),
    'statusLog': IDL.Vec(ProposalStatusLogEntry),
    'endTimerId': IDL.Opt(IDL.Nat),
    'timeEnd': IDL.Int,
    'proposerId': IDL.Principal,
  });
  const PagedResult = IDL.Record({
    'data': IDL.Vec(Proposal),
    'count': IDL.Nat,
    'offset': IDL.Nat,
  });
  const Result_2 = IDL.Variant({
    'ok': IDL.Tuple(IDL.Nat, IDL.Text, IDL.Text),
    'err': IDL.Text,
  });
  const VoteError = IDL.Variant({
    'proposalNotFound': IDL.Null,
    'notAuthorized': IDL.Null,
    'alreadyVoted': IDL.Null,
    'votingClosed': IDL.Null,
    'wrongVotingPower': IDL.Null,
  });
  const Result = IDL.Variant({ 'ok': IDL.Null, 'err': VoteError });
  return IDL.Service({
    'addMember': IDL.Func([IDL.Principal, IDL.Nat], [AddMemberResult], []),
    'createProposal': IDL.Func([ProposalContent], [Result_3], []),
    'createVotingRewardsProposal': IDL.Func(
      [IDL.Principal, IDL.Nat],
      [Result_3],
      [],
    ),
    'distributeMonthlyVotingRewards': IDL.Func([], [Result_1], []),
    'getMember': IDL.Func([IDL.Principal], [IDL.Opt(Member)], ['query']),
    'getProposal': IDL.Func([IDL.Nat], [IDL.Opt(Proposal)], ['query']),
    'getProposals': IDL.Func([IDL.Nat, IDL.Nat], [PagedResult], ['query']),
    'getRewards': IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))], []),
    'greet': IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'initLedger': IDL.Func([], [Result_2], []),
    'listMembers': IDL.Func([], [IDL.Vec(Member)], ['query']),
    'removeMember': IDL.Func([IDL.Principal], [Result_1], []),
    'runTests': IDL.Func([], [], []),
    'vote': IDL.Func([IDL.Nat, IDL.Text, IDL.Bool], [Result], []),
  });
};
// @ts-ignore
export const init = ({ IDL }) => { return []; };
