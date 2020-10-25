import react from 'react';
import { useQuery } from 'react-apollo';
import { gql } from "@8base/react-sdk";
import {useHistory} from 'react-router-dom';

const Orders = ()=>{
    const {loading, error, data} = useQuery(GetOrders);
    return (
        <>
            {loading?'Loading...':
                data.ordersList.items.map((order)=><Order order={order} key={order.id}/>)

            }
        </>
    )
}

const Order = ({order})=>{
    const history = useHistory();
    const {number, client, goods} = order;
    var newGoods = {};
    goods.items.forEach(function(x, i) {
        newGoods[x.id] = {
            count: (newGoods[x.id]?newGoods[x.id].count:0) + 1,
            coast: (newGoods[x.id]?x.coast:0) + x.coast
          }
        if(!newGoods[x.id].name){newGoods[x.id].name = x.name}
      });
    let newGoodsArr = [];
    for(let key in newGoods){
        newGoodsArr.push(newGoods[key])
    }
    return (
        <div>
            <h3>Order №{number}</h3>
            <a style={{color:'blue', cursor:'pointer'}} onClick={()=>{history.push(`/order/${order.id}`)}}>Go to order page</a><br/>
            Client: {client.firstName} {client.lastName}<br/>
            Goods:
            
            {newGoodsArr.map((good, i)=>{
                return (
                    <div key={'g'+i}>
                        <span style={{fontWeight:'800'}}>{good.name}</span> Count: {good.count}  Total coast: {good.coast}
                    </div>
                )
            })}
        </div>
    )
}

const GetOrders = gql`
query GetOrders{
    ordersList{
      items{
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
  }
`;

export default Orders;