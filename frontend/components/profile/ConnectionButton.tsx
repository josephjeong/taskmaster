import { Button } from '@material-ui/core'
import { ConnectionStatus, PropsOf } from '../../types'

const statusToText: Record<ConnectionStatus, string> = {
  [ConnectionStatus.CONNECTED]: 'Connected',
  [ConnectionStatus.UNCONNECTED]: 'Request Connection',
  [ConnectionStatus.REQUESTED]: 'Request Sent',
}

type ConnectionButtonProps = {
  status: ConnectionStatus
} & PropsOf<typeof Button>

const ConnectionButton: React.FC<ConnectionButtonProps> = ({
  status,
  ...rest
}) => {
  return (
    <Button
      {...rest}
      color={status === ConnectionStatus.CONNECTED ? 'default' : 'primary'}
      variant="contained"
    >
      {statusToText[status]}
    </Button>
  )
}

export default ConnectionButton
