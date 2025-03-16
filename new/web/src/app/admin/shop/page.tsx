"use client";
import { serverURL } from "@/utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiDollarSign, FiFileText, FiPlus, FiShoppingBag, FiTrash2, FiUsers } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { motion } from "framer-motion";

export default function Page() {
  const [shopItems, setShopItems] = useState<any>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [evaluatorLimit, setEvaluatorLimit] = useState(0);
  const [evaluationLimit, setEvaluationLimit] = useState(0);
  const [classesLimit, setClassesLimit] = useState(0);
  const [price, setPrice] = useState(0);
  const [selectedShopItemId, setSelectedShopItemId] = useState("");

  const getShopItems = async () => {
    const config = {
      method: "GET",
      url: `${serverURL}/admin/shop-items`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        setShopItems(response.data);
      })
      .catch((error) => {
        toast.error("Failed to get Shop Items");
      });
  }

  const createShopItem = async () => {
    if (!title || !description || !evaluatorLimit || !evaluationLimit || !classesLimit || !price) {
      toast.error("Please fill all fields");
      return;
    }

    const config = {
      method: "POST",
      url: `${serverURL}/admin/shop-items/new`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        title,
        description,
        evaluatorLimit,
        evaluationLimit,
        classesLimit,
        price
      }
    };

    axios(config)
      .then((response) => {
        toast.success("Shop Item created");
        getShopItems();
      })
      .catch((error) => {
        toast.error("Failed to get Shop Items");
      });
  }

  const editShopItem = async () => {
    if (!title || !description || !evaluatorLimit || !evaluationLimit || !classesLimit || !price) {
      toast.error("Please fill all fields");
      return;
    }

    const config = {
      method: "POST",
      url: `${serverURL}/admin/shop-items/edit`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        itemId: selectedShopItemId,
        title,
        description,
        evaluatorLimit,
        evaluationLimit,
        classesLimit,
        price
      }
    };

    axios(config)
      .then((response) => {
        toast.success("Shop Item updated");
        getShopItems();
      })
      .catch((error) => {
        toast.error("Failed to save Shop Item");
      });
  }

  const deleteShopItem = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/admin/shop-items/delete`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        itemId: selectedShopItemId,
      }
    };

    axios(config)
      .then((response) => {
        toast.success("Shop Item deleted");
        getShopItems();
      })
      .catch((error) => {
        toast.error("Failed to delete Shop Items");
      });
  }

  useEffect(() => {
    getShopItems();
  }, []);

  return (
    <div className="flex flex-col">
      <p className="flex items-center text-2xl font-semibold"><FiShoppingBag className="mr-2" /> Shop Items</p>
      <div className="flex pb-5 w-[80vw] flex-wrap gap-4 mt-4">
        <div
          className="cursor-pointer w-64 h-40 flex items-center justify-center rounded-lg border-dashed border-2 border-gray-300 font-semibold text-2xl hover:border-4 duration-100"
          onClick={() => (document.getElementById('new_shop_item_modal') as any).showModal()}
        >
          <FiPlus size={24} className="mr-2" /> New
        </div>
        {
          shopItems?.map((shopItem: any, index: number) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index / 10, duration: 0.4 }}
              key={index}
              className="cursor-pointer min-w-64 p-5 flex flex-col justify-between rounded-lg border-2 border-gray-300 font-semibold hover:border-gray-400 duration-100"
              onClick={() => {
                setTitle(shopItem?.title);
                setDescription(shopItem?.description);
                setEvaluatorLimit(shopItem?.evaluatorLimit);
                setEvaluationLimit(shopItem?.evaluationLimit);
                setClassesLimit(shopItem?.classesLimit);
                setPrice(shopItem?.price);
                setSelectedShopItemId(shopItem?._id);
                (document.getElementById('edit_shop_item_modal') as any).showModal();
              }}
            >
              <div className="flex flex-col space-y-2">
                <h2 className="font-bold">{shopItem?.title}</h2>
                <div className="badge badge-outline badge-primary badge-lg"><FiDollarSign /> {shopItem?.price}</div>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <div className="tooltip tooltip-bottom" data-tip="Evaluator Limit">
                  <div className="badge badge-soft badge-primary"><RiRobot2Line /> {shopItem?.evaluatorLimit}</div>
                </div>
                <div className="tooltip tooltip-bottom" data-tip="Evaluation Limit">
                  <div className="badge badge-soft badge-primary"><FiFileText /> {shopItem?.evaluationLimit}</div>
                </div>
                <div className="tooltip tooltip-bottom" data-tip="Classes Limit">
                  <div className="badge badge-soft badge-primary"><FiUsers /> {shopItem?.classesLimit}</div>
                </div>
              </div>
            </motion.div>
          ))
        }
      </div>
      {/* Create Shop Item Modal */}
      <dialog id="new_shop_item_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiShoppingBag className="mr-2" /> Create Shop Item</h3>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Title</legend>
            <input type="text" className="input w-full" placeholder="Title" value={title} onChange={(x) => setTitle(x.target.value)} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Description</legend>
            <textarea className="textarea w-full h-24" placeholder="Description" value={description} onChange={(x) => setDescription(x.target.value)}></textarea>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Evaluator Limit</legend>
            <input type="number" className="input w-full" placeholder="Evaluator Limit" value={evaluatorLimit} onChange={(x) => setEvaluatorLimit(parseInt(x.target.value))} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Evaluation Limit</legend>
            <input type="number" className="input w-full" placeholder="Evaluation Limit" value={evaluationLimit} onChange={(x) => setEvaluationLimit(parseInt(x.target.value))} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Classes Limit</legend>
            <input type="number" className="input w-full" placeholder="Classes Limit" value={classesLimit} onChange={(x) => setClassesLimit(parseInt(x.target.value))} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Price</legend>
            <input type="number" className="input w-full" placeholder="Price" value={price} onChange={(x) => setPrice(parseInt(x.target.value))} />
          </fieldset>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn mr-2">Cancel</button>
              <button className="btn btn-primary" onClick={() => {
                createShopItem();
              }}>Create Shop Item</button>
            </form>
          </div>
        </div>
      </dialog >
      {/* Edit Shop Item Modal */}
      <dialog id="edit_shop_item_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiShoppingBag className="mr-2" /> Edit Shop Item</h3>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Title</legend>
            <input type="text" className="input w-full" placeholder="Title" value={title} onChange={(x) => setTitle(x.target.value)} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Description</legend>
            <textarea className="textarea w-full h-24" placeholder="Description" value={description} onChange={(x) => setDescription(x.target.value)}></textarea>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Evaluator Limit</legend>
            <input type="number" className="input w-full" placeholder="Evaluator Limit" value={evaluatorLimit} onChange={(x) => setEvaluatorLimit(parseInt(x.target.value))} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Evaluation Limit</legend>
            <input type="number" className="input w-full" placeholder="Evaluation Limit" value={evaluationLimit} onChange={(x) => setEvaluationLimit(parseInt(x.target.value))} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Classes Limit</legend>
            <input type="number" className="input w-full" placeholder="Classes Limit" value={classesLimit} onChange={(x) => setClassesLimit(parseInt(x.target.value))} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Price</legend>
            <input type="number" className="input w-full" placeholder="Price" value={price} onChange={(x) => setPrice(parseInt(x.target.value))} />
          </fieldset>
          <div className="modal-action">
            <form method="dialog" className="w-full flex justify-between">
              <button className="btn hover:btn-error mr-2" onClick={() => (document.getElementById('delete_shop_item_modal') as any).showModal()}><FiTrash2 /> Delete Shop Item</button>
              <div>
                <button className="btn mr-2">Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  editShopItem();
                }}>Update Shop Item</button>
              </div>
            </form>
          </div>
        </div>
      </dialog >
      {/* Delete Shop Item Modal */}
      <dialog id="delete_shop_item_modal" className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiTrash2 className="mr-2" /> Delete Shop Item</h3>
          <p className="py-4">Are you sure you want to delete this Shop Item?</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn mr-2">Cancel</button>
              <button className="btn btn-error" onClick={() => deleteShopItem()}>Delete</button>
            </form>
          </div>
        </div>
      </dialog>
    </div >
  );
}
