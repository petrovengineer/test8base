import react, { useEffect, useState } from 'react';
import { gql } from "@8base/react-sdk";
import { useQuery } from 'react-apollo';
import {useHistory} from 'react-router-dom';

const Client  = ({match})=>{
    const history = useHistory();
    const [total, setTotal] = useState(0);
    const { loading, error, data = {client:{}} } = useQuery(ClientQuery, {variables:{id:match.params.id}});
    const {client:{email, firstName, lastName, orders}} = data;
    useEffect(()=>{
        if(data.client.orders){
            let ordersTotal = 0;
            data.client.orders.items.map((order)=>{
                order.goods.items.map((item)=>{
                    ordersTotal = ordersTotal + item.coast;
                })
            })
            setTotal(ordersTotal);
        }
    }, [data])
    return (
        <>
            <h2>CLIENT PAGE</h2>
            <h3>Total orders coast: {total}$</h3>
            {loading?'Loading...':
                <>
                    <p>Email: {email}</p>
                    <p>{firstName} {lastName}</p>
                    <h3>Orders:</h3>
                    {orders.items.length===0?'No orders':
                        orders.items.map((order, i)=>
                            <p style={{color:'blue', cursor:"pointer"}} key={'order'+i}>
                                <a onClick={()=>{history.push(`/order/${order.id}`)}}>Order №{order.number}</a>
                            </p>)
                    }
                </>
            }
        </>
    )
}

export default Client;

const ClientQuery = gql`
query GetClient($id: ID){
    client(id:$id){
      email
      firstName
      lastName
      orders{
        items{
            id
            number
          goods{
            items{
              name
              coast
            }
          }
        }
      }
    }
  }
`;