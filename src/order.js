import react, {useEffect, useState} from 'react';
import { gql } from "@8base/react-sdk";
import { useQuery } from 'react-apollo';

const Order = ({match})=>{
    const { loading, error, data} = useQuery(OrderQuery, {variables:{id:match.params.id}});
    const { loading:loadingGoods, error: errorGoods, data: dataGoods} = useQuery(GoodsList);
    const [add, showAdd] = useState(true);

    return (
        <>
                {!loading?<h1>Order №{data.order.number}</h1>:'Loading...'}
            {loading?'loading...':
                <>
                    {data.order.goods.items.map((good)=><Good good={good} key={good.id}/>)}
                    Add more: &nbsp;
                    {loadingGoods?'loading...':
                        dataGoods.goodsList.items.map((good,i)=>{
                            return (
                                <button key={'good'+i}>{good.name}</button>
                            )
                        })
                    }
                    <h3>Total: {Object.values(data.order.goods.items).reduce((prev,{coast})=>(coast+prev),0)}$</h3>
                </>
            }
        </>
    )
}

export default Order;

const Good = ({good})=>{
    return (
        <>
            <p>{good.name} - {good.coast}$</p>
        </>
    )
}

const OrderQuery = gql`
query GetOrder($id: ID){
    order(id:$id){
          id
          number
      client{
        id
        email
        firstName
        lastName
      }
      goods{
        items{
            id
            name
            coast
        }
      }
    }
  }
`;

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

const UpdateOrder = gql`
mutation UpdateOrder(
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