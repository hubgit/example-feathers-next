import feathers from '../feathers'
import { Component } from 'react'
import { List, ListItem } from 'material-ui/List'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAddIcon from 'material-ui/svg-icons/content/add'
import ContentRemoveIcon from 'material-ui/svg-icons/action/delete'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Form } from 'formsy-react'
import { FormsyText } from 'formsy-material-ui'
import Pagination from 'pagination-material-ui'
import injectTapEventPlugin from 'react-tap-event-plugin'

const service = feathers.service('articles')

export default class Articles extends Component {
  constructor (props) {
    super(props)

    this.state = {
      items: null,
      open: false
    }
  }

  componentDidMount () {
    this.subscriber = this.fetch()
    injectTapEventPlugin()
  }

  componentWillUnmount () {
    this.subscriber.unsubscribe()
  }

  openForm = () => this.setState({ open: true })

  closeForm = () => this.setState({ open: false }) && this.form.reset()

  submitForm = () => this.form.submit()

  fetch = (currentPage = 1, limit = 5) => {
    return service.find({
      query: {
        $sort: { createdAt: -1 },
        $limit: limit,
        $skip: (currentPage - 1) * limit
      }
    }).subscribe(items => {
      this.setState({ items })
    })
  }

  paginationChange = (currentPage, limit) => this.fetch(currentPage, limit)

  createItem = (data) => service.create(data).then(this.closeForm)

  removeItem = (id) => service.remove(id)

  render () {
    const { items, open } = this.state

    return items && (
      <MuiThemeProvider>

        <div style={{ padding: 20, maxWidth: 600 }}>
          <h1>Articles</h1>

          <List>
            { items.data.map(item => (
              <ListItem key={item._id} primaryText={item.title} rightIconButton={
                <IconButton touch={true} onTouchTap={() => this.removeItem(item._id)}>
                  <ContentRemoveIcon color="#aaa"/>
                </IconButton>
              }/>
            )) }
          </List>

          <Pagination onChange={this.paginationChange} total={items.total} limit={items.limit}/>

          <FloatingActionButton onTouchTap={this.openForm}>
            <ContentAddIcon/>
          </FloatingActionButton>

          <Dialog open={open} modal={true} onRequestClose={this.closeForm} title="Add" actions={[
            <FlatButton label="Cancel" primary={false} onTouchTap={this.closeForm} />,
            <FlatButton label="Save" primary={true} onTouchTap={this.submitForm} />
          ]}>
            <Form onValidSubmit={this.createItem} ref={form => (this.form = form)}>
              <FormsyText name="title" required autoFocus fullWidth={true} floatingLabelText="Title"/>
            </Form>
          </Dialog>
        </div>
      </MuiThemeProvider>
    )
  }
}
