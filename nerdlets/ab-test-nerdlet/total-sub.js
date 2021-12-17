import React from 'react';
import { HeadingText, PieChart, NrqlQuery } from 'nr1';

const ACCOUNT_ID = 3293563
export default class TotalSubscriptions extends React.Component {
  render() {
    return <>
      <HeadingText className="chartHeader">Total Subscribed</HeadingText>
      <NrqlQuery
        accountId={ACCOUNT_ID}
        query="SELECT count(*) FROM subscription FACET page_version SINCE 7 DAYS AGO"
        pollInterval={60000}
      >
        {
          ({ data }) => {
            return <PieChart data={data} fullWidth />
          }
        }
      </NrqlQuery>
    </>
  }
}