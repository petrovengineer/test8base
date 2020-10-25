import React, { useState } from 'react';
import { useMutation, useQuery} from 'react-apollo';
import { gql } from "@8base/react-sdk";
import {useHistory} from 'react-router-dom';

const Clients = ()=>{
    let [email, setEmail] = useState('');
    let [fName, setFName] = useState('');
    let [lName, setLName] = useState('');
    const [createClient] = useMutation(ClientCreate, {update(cache, {data:{clientCreate}}){
        setEmail('');
        setFName('');
        setLName('');
        let {clientsList} = cache.readQuery({query: ClientsList});
        let newClientList = {};
        newClientList.items = [...clientsList.items, clientCreate];
        newClientList.__typename= "ClientListResponse"
        cache.writeData({data:{clientsList:newClientList}});
    }})
    const [deleteClient] = useMutation(DeleteClient, {update(cache, {data:{clientDelete}}){
        if(clientDelete.success){
            let {clientsList} = cache.readQuery({query: ClientsList});
            let newClientList = {};
            newClientList.items = [...clientsList.items];
            newClientList.items.splice(current, 1);
            newClientList.__typename= "ClientListResponse"
            cache.writeData({data:{clientsList:newClientList}});
        }
    }})
    const [updateClient] = useMutation(UpdateClient, {update(cache, {data:{clientUpdate}}){
        if(clientUpdate){
            let {clientsList} = cache.readQuery({query: ClientsList});
            let newClientList = {};
            newClientList.items = [...clientsList.items];
            newClientList.items[current].email=email;
            newClientList.items[current].firstName=fName;
            newClientList.items[current].lastName=lName;
            newClientList.__typename= "ClientListResponse";
            cache.writeData({data:{clientsList:newClientList}});
        }
    }})
    const { loading, error, data } = useQuery(ClientsList);
    return (
        <>
            <h2>CLIENTS</h2>
            <p>New client:</p>
            Email: <input type="text" value = {email} onChange={(e)=>{setEmail(e.target.value)}}/>| 
            First Name: <input type="text" value = {fName} onChange={(e)=>{setFName(e.target.value)}}/>|
            Last Name: <input type="text" value = {lName} onChange={(e)=>{setLName(e.target.value)}}/>|
            <button onClick={()=>createClient({variables: {email:email,firstName:fName,lastName: lName}})}>
                Создать
            </button>
            {loading?<p>loading...</p>:data.clientsList.items.map((client,i)=>(
                    <Client 
                        key={client.id} 
                        id={client.id}
                        email={client.email}
                        firstName={client.firstName} 
                        lastName={client.lastName}
                        index = {i}
                        deleteClient = {deleteClient}
                        setEmail = {setEmail}
                        setFName = {setFName}
                        setLName = {setLName}
                        updateClient={updateClient}
                        fName={fName}
                        lName={lName}
                    />
            ))}
        </>
    )
}

export default Clients;

let current = null;

const Client = ({email, firstName, lastName, id, deleteClient, index ,setEmail, setFName, setLName, updateClient, fName, lName})=>{
    let [loading, setLoading] = useState(false);
    let [update, setUpdate] = useState(false);
    const history = useHistory()
    return (
    <p>
        {firstName} {lastName} |&nbsp;
        <a style={{color:'gray', cursor:'pointer'}} onClick={() => {
          history.push(`/client/${id}`)
        }} >personal page</a> |&nbsp;
        <span style={{color:'red', cursor:'pointer'}} 
        onClick={()=>{setLoading(true); deleteClient({variables:{id}}); current = index}}>
            {loading?<span style={{color:'blue'}}>loading...</span>:'delete'} 
        </span> |
        {!update?
        <span style={{color:'green', cursor:'pointer'}} 
        onClick={()=>{
            setUpdate(true);
            setEmail(email);
            setFName(firstName);
            setLName(lastName);
        }}>
            &nbsp; change
        </span>
        :
            <>
                <span style={{color:'blue', cursor:'pointer'}}
                    onClick={()=>{
                        current = index;
                        updateClient({variables: {id, email:email,firstName:fName,lastName: lName}});
                        setUpdate(false);
                        setEmail('');
                        setFName('');
                        setLName('');
                    }}
                >&nbsp;save</span> | 
                <span style={{color:'brown', cursor:'pointer'}} onClick={()=>{
                    setUpdate(false);
                    setEmail('');
                    setFName('');
                    setLName('');
                }}>&nbsp;cancel</span>
            </>
        }
    </p>
)}

const ClientsList = gql`
    query{clientsList{
        items{
        id
        email
        firstName 
        lastName
        orders{
            count
        }
    }
    }
    }
`;

const ClientCreate = gql`
mutation CreateClient(
    $email:String!
    $firstName: String!
    $lastName: String!
  ){
    clientCreate(data:{
      email:$email
      firstName: $firstName
      lastName: $lastName
    }) {
      id
      email
      firstName
      lastName
      orders{
          count
      }
    }
  }
`;

const DeleteClient = gql`
mutation DeleteClient(
    $id:ID!
  ){
    clientDelete(data:{
      id:$id
    }) {
      success
    }
  }
`;

const UpdateClient = gql`
mutation UpdateClient(
    $id:ID!
    $email:String
    $firstName:String
    $lastName:String
  ){
    clientUpdate(
      filter:{
        id:$id
      }
      data:{
        email:$email
        firstName: $firstName
        lastName: $lastName
      }) {
      id
    }
  }
`;