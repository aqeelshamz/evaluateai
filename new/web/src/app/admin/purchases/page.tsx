"use client";
import { currencySymbol, serverURL } from "@/utils/config";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { FiDollarSign, FiEdit, FiPlus, FiShoppingCart, FiUsers } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [purchases, setPurchases] = useState([]);

  const getPurchases = async () => {
    setLoading(true);
    const config = {
      method: "GET",
      url: `${serverURL}/admin/purchases`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        setPurchases(response.data);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getPurchases();
  }, [])

  return (
    <div className="flex flex-col">
      <p className="flex items-center text-2xl font-semibold"><FiShoppingCart className="mr-2" /> My Purchases</p>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mt-5">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Date</th>
              <th>Shop Item</th>
              <th>User</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {
              purchases?.map((purchase: any, index: number) => {
                return <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{moment(purchase?.updatedAt).format("DD MMM YYYY, hh:MM A")}</td>
                  <td>{purchase?.shopItem?.title}<br />
                    <div className="badge badge-soft badge-primary mt-3"><RiRobot2Line /> Evaluators: {purchase?.shopItem?.evaluatorLimit}</div><br />
                    <div className="badge badge-soft badge-primary mt-3"><FiEdit /> Evaluations: {purchase?.shopItem?.evaluationLimit}</div><br />
                    <div className="badge badge-soft badge-primary mt-3"><FiUsers /> Classes: {purchase?.shopItem?.classesLimit}</div><br /></td>
                  <td><p className="font-semibold">{purchase?.user?.name}</p>{purchase?.user?.email}</td>
                  <td>{currencySymbol}{purchase?.amount}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
