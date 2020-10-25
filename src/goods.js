import React, { useState } from 'react';
import { useMutation, useQuery} from 'react-apollo';
import { gql } from "@8base/react-sdk";
import {useHistory} from 'react-router-dom';

const Goods = ()=>{
    let [name, setName] = useState('');
    let [coast, setCoast] = useState('');
    const [createGood] = useMutation(GoodCreate, {update(cache, {data:{goodCreate}}){
        setName('');
        setCoast('');
        let {goodsList} = cache.readQuery({query: GoodsList});
        let newGoodsList = {};
        newGoodsList.items = [...goodsList.items, goodCreate];
        newGoodsList.__typename= "GoodListResponse"
        cache.writeData({data:{goodsList:newGoodsList}});
    }})
    const [deleteGood] = useMutation(DeleteGood, {update(cache, {data:{goodDelete}}){
        if(goodDelete.success){
            let {goodsList} = cache.readQuery({query: GoodsList});
            let newGoodList = {};
            newGoodList.items = [...goodsList.items];
            newGoodList.items.splice(current, 1);
            newGoodList.__typename= "GoodListResponse"
            cache.writeData({data:{goodsList:newGoodList}});
        }
    }})
    const [updateGood] = useMutation(UpdateGood, {update(cache, {data:{goodUpdate}}){
        if(goodUpdate){
            let {goodsList} = cache.readQuery({query: GoodsList});
            let newGoodList = {};
            newGoodList.items = [...goodsList.items];
            newGoodList.items[current].name=name;
            newGoodList.items[current].coast=coast;
            newGoodList.__typename= "GoodListResponse";
            cache.writeData({data:{goodsList:newGoodList}});
        }
    }})
    const { loading, error, data } = useQuery(GoodsList);
    return (
        <>
            <h2>GOODS</h2>
            <p>New good:</p>
            Name: <input type="text" value = {name} onChange={(e)=>{setName(e.target.value)}}/>|
            Coast: <input type="text" value = {coast} onChange={(e)=>{setCoast(e.target.value)}}/>|
            <button onClick={()=>createGood({variables: {name:name,coast: Number.parseInt(coast)}})}>
                Создать
            </button>
            {loading?<p>loading...</p>:data.goodsList.items.map((good,i)=>(
                    <Good 
                        key={good.id} 
                        id={good.id}
                        goodname={good.name} 
                        goodcoast={good.coast}
                        index = {i}
                        deleteGood = {deleteGood}
                        setName = {setName}
                        setCoast = {setCoast}
                        updateGood={updateGood}
                        name={name}
                        coast={coast}
                    />
            ))}
        </>
    )
}

export default Goods;

let current = null;

const Good = ({goodname, goodcoast, id, deleteGood, index , setName, setCoast, updateGood, name, coast})=>{
    let [loading, setLoading] = useState(false);
    let [update, setUpdate] = useState(false);
    const history = useHistory()
    return (
    <p>
        {goodname} - {goodcoast}$ |&nbsp;
        <a style={{color:'gray', cursor:'pointer'}} onClick={() => {
          history.push(`/good/${id}`)
        }} >good page</a> |&nbsp;
        <span style={{color:'red', cursor:'pointer'}} 
        onClick={()=>{setLoading(true); deleteGood({variables:{id}}); current = index}}>
            {loading?<span style={{color:'blue'}}>loading...</span>:'delete'} 
        </span> |
        {!update?
        <span style={{color:'green', cursor:'pointer'}} 
        onClick={()=>{
            setUpdate(true);
            setName(goodname);
            setCoast(goodcoast);
        }}>
            &nbsp; change
        </span>
        :
            <>
                <span style={{color:'blue', cursor:'pointer'}}
                    onClick={()=>{
                        current = index;
                        updateGood({variables: {id, name:name,coast: Number.parseInt(coast)}});
                        setUpdate(false);
                        setName('');
                        setCoast('');
                    }}
                >&nbsp;save</span> | 
                <span style={{color:'brown', cursor:'pointer'}} onClick={()=>{
                    setUpdate(false);
                    setName('');
                    setCoast('');
                }}>&nbsp;cancel</span>
            </>
        }
    </p>
)}

const GoodsList = gql`
    query{goodsList{
        items{
        id
        name 
        coast
    }
    }
    }
`;

const GoodCreate = gql`
mutation CreateGood(
    $name: String!
    $coast: Int!
  ){
    goodCreate(data:{
      name: $name
      coast: $coast
    }) {
      id
      name
      coast
    }
  }
`;

const DeleteGood = gql`
mutation DeleteGood(
    $id:ID!
  ){
    goodDelete(data:{
      id:$id
    }) {
      success
    }
  }
`;

const UpdateGood = gql`
mutation UpdateGood(
    $id:ID!
    $name:String!
    $coast:Int!
  ){
    goodUpdate(
      filter:{
        id:$id
      }
      data:{
        name: $name
        coast: $coast
      }) {
      id
    }
  }
`;