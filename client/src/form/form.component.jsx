import React, { Component } from 'react';
import axios from 'axios';

export default class LoginForm extends Component {
    constructor(props) {
        super(props);

        //avoid this = undefined in methods
        this.onChangePhonenumber = this.onChangePhonenumber.bind(this);
        this.onChangeAccesscode = this.onChangeAccesscode.bind(this);
        this.onSubmitPhonenumber = this.onSubmitPhonenumber.bind(this);
        this.onSubmitAccesscode = this.onSubmitAccesscode.bind(this);

        this.state = {
            phonenumber: '',
            accesscode: '',
            submitphonenumber: false,
            success: false
        };
    }

    onChangePhonenumber(e) {
        this.setState({
            phonenumber: e.target.value
        });

    }

    onChangeAccesscode(e) { 
        this.setState({
            accesscode: e.target.value
        });

    }

    async onSubmitPhonenumber(e) {
        e.preventDefault();
        const number = this.state.phonenumber;

        try {
            //send phone number to API
            await axios.post(`http://localhost:5001/login-app-b2651/us-central/app/api/create/${number}`)

        } catch (err) {
            console.log(err)
        }

        //update state to display Access Code form
        this.setState({
            submitphonenumber: true
        })
    }     
    
    onSubmitAccesscode(e) {
        e.preventDefault();
        const number = this.state.phonenumber;
        const accessCode = this.state.accesscode;

        try {
            //send phone number and access code to APi for validation
            axios.post(`http://localhost:5001/login-app-b2651/us-central/app/api/validate/${number}/${accessCode}`)
            .then(res => {
                //update state to display success message if validated successfully
                this.setState({
                    success: res.data.success
                })
            })
    
        } catch (err) {
            console.log(err)
        }
        
    }     

    render() {
        return (
            <div className="container mt-5">

                {this.state.submitphonenumber ? 
                    <form onSubmit={this.onSubmitAccesscode}>
                        <div className="form-group">
                            <h2>Access Code:</h2>
                            <input 
                                type="number"
                                className="form-control"
                                value={this.state.accesscode}
                                onChange={this.onChangeAccesscode}
                                placeholder="123456"
                                required>
                            </input>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Submit Access Code" className="btn btn-primary form-control"></input>
                        </div>
                    </form>
                : null }
                
                {!this.state.submitphonenumber ? 
                    <form onSubmit={this.onSubmitPhonenumber}>
                        <div className="form-group">
                            <h2>Phone Number:</h2>
                            <input 
                                type="text"
                                className="form-control"
                                value={this.state.phonenumber}
                                onChange={this.onChangePhonenumber}
                                placeholder="+19876543210"
                                required>
                            </input>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Submit Phone Number" className="btn btn-primary form-control" ></input>
                        </div>
                    </form>
                    : null}

                {this.state.success ? <div className="alert alert-success text-center" role="alert">Success!</div> : null}

            </div>
                        

        )
    }
}
