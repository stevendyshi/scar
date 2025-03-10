import { DataTable } from 'grommet'
import prettyBytes from 'pretty-bytes'
import { useHistory } from 'react-router'
import TimeAgo from 'timeago-react'
import { ListTransactionsQuery } from '../generated/graphql'
import { formatNumber, formatTime } from '../utils/formatter'
import DataTablePlaceholder from './data-table-placeholder'

export default function TransactionsList(props: {
  value?: ListTransactionsQuery['transactions']['edges'][0]['node'][]
  relativeTime?: boolean
}) {
  const { value: transactions } = props
  const history = useHistory()

  return (
    <DataTable
      primaryKey={false}
      columns={[
        {
          property: 'id',
          render: (transaction) =>
            `${transaction.id.substr(0, 8)}...${transaction.id.substr(
              transaction.id.length - 8,
              transaction.id.length,
            )}`,
          header: 'Hash',
        },
        {
          property: 'data.type',
          header: 'Type',
          render: (transaction) =>
            transaction.recipient ? '[transfer]' : transaction.data.type || '-',
        },
        {
          property: 'data.size',
          render: (transaction) =>
            transaction.recipient
              ? `${formatNumber(parseFloat(transaction.quantity.ar))} AR`
              : prettyBytes(parseInt(transaction.data.size, 10), {
                  locale: true,
                  binary: true,
                }),
          align: 'end',
          header: 'Size / Amount',
        },
        {
          property: 'transaction.block',
          render: (transaction) =>
            transaction.block ? (
              props.relativeTime ? (
                <TimeAgo datetime={transaction.block.timestamp * 1000} />
              ) : (
                formatTime(new Date(transaction.block.timestamp * 1000))
              )
            ) : (
              'Pending'
            ),
          align: 'end',
          header: 'Timestamp',
        },
      ]}
      data={transactions}
      fill="vertical"
      placeholder={
        transactions?.length ? undefined : (
          <DataTablePlaceholder empty={transactions?.length === 0} />
        )
      }
      onClickRow={({ datum: transaction }) => {
        history.push(`/tx/${transaction.id}`)
      }}
    />
  )
}
