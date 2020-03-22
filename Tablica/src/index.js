import React, {Component} from "react";
import ReactDOM from "react-dom";
import "./Style.scss";

class App extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            isLoaded: false,
            error: null,
            items: [],
            showDodaj: false,
            showAboutApp: false,
        }
    }
    componentDidMount() {
       this.load();
    }
    load = () => {
        fetch('http://localhost:3000/ogloszenia')
        .then(resp => resp.json())
        .then((result) => {
              this.setState({
                isLoaded: true,
                items: result,
              });
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
    }
    showModalAboutApp = () => {
        this.setState({showAboutApp: true})
    }
    hideModalAboutApp = () => {
        this.setState({showAboutApp: false})
    }
    showModalDodaj = () => {
        this.setState({showDodaj: true})
    }
    hideModalDodaj = () => {
        this.setState({showDodaj: false})
    }
    render() {
        const { error, isLoaded, items, showDodaj, showAboutApp} = this.state;
        if (error) {
            return <div>Błąd: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Ładowanie...</div>;
        } else {
            return <>
                {showAboutApp === true && <AboutAppModal hideModalAboutApp={() => this.hideModalAboutApp()}/>}
                {showDodaj === true && <DodajModal Load={this.load} hideModalDodaj={() => this.hideModalDodaj()}/>}
                <TablicaHeader />
                <div className='container'>
                    <TablicaBody items={items} Load={this.load} showModalDodaj={() => this.showModalDodaj()} showModalAboutApp={() => this.showModalAboutApp()}/>
                </div>
                </>
        }
    }
}

class TablicaHeader extends Component {
    render() {
        return <>
            <section>
                <div className="tablicaHeader"><h1>Tablica dla Muzyk.pl</h1></div>
            </section>
        </>
    }
}

class TablicaBody extends Component {
    render() {
        const {items, Load, showModalDodaj, showModalAboutApp} = this.props
        return <>
            <TablicaNav showModalDodaj={showModalDodaj} showModalAboutApp={showModalAboutApp}/>
            <TablicaOgloszenia items={items} Load={Load}/>
        </>
    }
}

class TablicaNav extends Component {
    render() {
        const {showModalDodaj, showModalAboutApp} = this.props
        return <>
            <section className='sectionNav'>
                <ul>
                    <li><a href="#add" onClick={showModalDodaj}>Dodaj ogloszenie</a></li>
                    <li><a href="#contact" onClick={showModalAboutApp}>Coś o aplikacji</a></li>
                </ul>
            </section>
        </>
    }
}

class TablicaOgloszenia extends Component {
    state = {
        showEdit: false, 
        id: '',
        title: '',
        author: '',
        description: '',
        phone: '',
        email: ''
    }
    showModalEdit = (e) => {
        this.setState({
            showEdit: true, 
            id: e.target.id,
            title: e.target.title,
            author: e.target.author,
            description: e.target.description,
            phone: e.target.phone,
            email: e.target.email
        })
        console.log(e.target.author)
    }
    hideModalEdit = () => {
        this.setState({showEdit: false})
    }
    remove = (e) => {
        const {Load} = this.props
        fetch('http://localhost:3000/ogloszenia/' + e.target.id, {
            method: 'DELETE'
          }).then(() => {
             console.log('removed');
          })
        //   .catch(err => {
        //     console.error(err)
        //   });
        .then(Load)
    }
    render() {
        const {showEdit, id, title, author, description, phone, email} = this.state
        const {items, Load} = this.props
        return <>
            {showEdit === true && 
                <EditModal 
                    id={id}
                    title={title}
                    author={author}
                    description={description}
                    phone={phone}
                    email={email}
                    Load={Load} 
                    hideModalEdit={() => this.hideModalEdit()}
                />
            }
            <section className="sectionOgloszenia">
                    {items.map(post => <div className="ogloszenie" key={post.id}>
                        <i className="far fa-edit" id={post.id} title={post.title} author={post.author} phone={post.phone} email={post.email} onClick={this.showModalEdit}></i>
                        <i className="far fa-trash-alt" id={post.id} onClick={this.remove}></i>
                        <h2>{post.title}</h2>
                        <h3>Autor:{post.author}</h3>
                        <p>{post.description}</p>
                        <span><strong>Telefon:</strong> {post.phone}</span>
                        <span><strong>E-mail:</strong> {post.email}</span>
                    </div>)}
            </section>
        </>
    }
}

class DodajModal extends Component {
    state = {title: '', author: '', description: '', phone: '', email: ''}
    handleSubmit = (e) => {
        const {Load} = this.props
        // e.preventDefault();
        const data = { 
            title: this.state.title, 
            author: this.state.author, 
            description: this.state.description, 
            phone: this.state.phone, 
            email: this.state.email 
        };
        fetch('http://localhost:3000/ogloszenia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        })
        // .catch((error) => {
        //     console.error('Error:', error);
        // })
        .then(Load);
    }
    handleChange = () => {
        this.setState({[event.target.name]: event.target.value})
    }
    render() {
        const {hideModalDodaj} = this.props
        return <>
            <div className='modalDodaj'>
                <span className="closeBTN" onClick={hideModalDodaj}>+</span>
                    <form onSubmit={this.handleSubmit}>
                        <div className='divInput'>
                            <span>Tytul:</span> 
                            <input type='text' name="title" onChange={this.handleChange}></input>
                        </div>
                        <div className='divInput'>
                            <span>Autor:</span>
                            <input type='text' name="author" onChange={this.handleChange}></input>
                        </div>
                        <div className='divInput'>
                            <span>Telefon:</span>
                            <input type='number' name="phone" onChange={this.handleChange}></input>
                        </div>
                        <div className='divInput'>
                            <span>Email:</span>
                            <input type='email' name="email" onChange={this.handleChange}></input>
                        </div>
                        <div className='divTextarea'>
                            <span>Opis:</span>
                            <textarea rows="7" cols="47" name="description" onChange={this.handleChange} ></textarea>
                        </div>
                        <div className='divInput'>
                            <input className='btn'  type='submit' name="dodajOgloszenie" value="Dodaj"></input>
                        </div>
                    </form>
            </div>
        </>
    }
}

class EditModal extends Component {
    state = {title: this.props.title , author: this.props.author, description: this.props.description, phone: this.props.phone, email: this.props.email}
    handleSubmit = (e) => {
        const {Load, id} = this.props
        // e.preventDefault();
        const data = { 
            title: this.state.title, 
            author: this.state.author, 
            description: this.state.description, 
            phone: this.state.phone, 
            email: this.state.email 
        };
        fetch('http://localhost:3000/ogloszenia/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        })
        // .catch((error) => {
        //     console.error('Error:', error);
        // })
        .then(Load);
    }
    handleChange = () => {
        this.setState({[event.target.name]: event.target.value})
    }
    render() {
        const {hideModalEdit} = this.props
        return <>
            <div className='modalEdit'>
                <span className="closeBTN" onClick={hideModalEdit}>+</span>
                    <form onSubmit={this.handleSubmit}>
                        <div className='divInput'>
                            <span>Tytul:</span> 
                            <input type='text' placeholder={this.props.title} name="title" onChange={this.handleChange}></input>
                        </div>
                        <div className='divInput'>
                            <span>Autor:</span>
                            <input type='text' placeholder={this.props.author}name="author" onChange={this.handleChange}></input>
                        </div>
                        <div className='divInput'>
                            <span>Telefon:</span>
                            <input type='number'placeholder={this.props.phone} name="phone" onChange={this.handleChange}></input>
                        </div>
                        <div className='divInput'>
                            <span>Email:</span>
                            <input type='email' placeholder={this.props.email}name="email" onChange={this.handleChange}></input>
                        </div>
                        <div className='divTextarea'>
                            <span>Opis:</span>
                            <textarea rows="7" cols="47" placeholder={this.props.description} name="description" onChange={this.handleChange} ></textarea>
                        </div>
                        <div className='divInput'>
                            <input className='btn'  type='submit' name="dodajOgloszenie" value="Dodaj"></input>
                        </div>
                    </form>
            </div>
        </>
    }
}

class AboutAppModal extends Component {
    render() {
        const {hideModalAboutApp} = this.props
        return <>
            <div className='modalAboutApp'>
                <span className="closeBTN" onClick={hideModalAboutApp}>+</span>
                <div className="aboutApp">
                    <h2>Tablica ogloszeniowa</h2>
                    <p>O to moja prosta aplikacja, dokladniej tabliba ogloszeniowa. Napisana za pomoca biblioteki React ktora korzysta z bazy danych, uruchomiona za pomoca json-server'a w ktorej wykonuje proste polecenia jak GET,POST,PUT,DELETE. W paru prostych slowach umozliwa odczytanie, zapisanie, edytowanie i usuniecie ogloszen ktore sa zapisane na localhoscie.</p>
                </div>
           </div>
        </>
    }
}




ReactDOM.render(
    <App />,
    document.getElementById("app")
  );