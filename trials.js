export const startTrial = (user) => {
    const now=new Date();
    const trialEndDate=new Date(now);
    trialEndDate;setDate(trialEnds.getDate()+7);

    user.trialStart = now;
    user.trialEnd = trialEndDate;
    user.subscriptionStatus = 'trial';

    return user;
};