import { useParams } from 'react-router-dom';

/**
 * TODO:
 * First check if the campagin exists in the smart contract, it it's not there
 * then check whether or not it is pending by checking the redis database.
 * 
 * If it was not found then we must search for the campaign in the smart contract
 * Then calculate if the crowdfunding is expired (deleted after two weeks)
 */

// A campaign can be pending, active or expired.
function CampaignPage() {
    const { campaignId } = useParams();

    return (
        <>
            <p>Campaign with id: {campaignId}</p>
        </>
    );
};

export default CampaignPage;