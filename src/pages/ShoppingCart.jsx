import React, { useState } from "react";
import image from "../assets/image.png";
import { Button } from "@/components/ui/button";
import Rating from "@/components/Rating";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
import { payLesson } from "@/services/lessonAPI";
import { useNavigate } from "react-router";
const ShoppingCart = () => {
  const lessons = JSON.parse(localStorage.getItem("cart")) || [];
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();
  const orderDetails = [
    {
      name: "Subtotal",
      value: `$${lessons
        .reduce((acc, lesson) => acc + lesson.price, 0)
        .toFixed(2)}`,
    },
    { name: "Discount", value: "$0.00" },
    {
      name: "Tax",
      value: `$${(
        lessons.reduce((acc, lesson) => acc + lesson.price, 0) * 0.1
      ).toFixed(2)}`,
    },
    {
      name: "Total",
      value: `$${(
        lessons.reduce((acc, lesson) => acc + lesson.price, 0) * 1.1
      ).toFixed(2)}`,
    },
  ];

  const handleRemoveFromCart = (id) => {
    const updatedCart = lessons.filter((lesson) => lesson._id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Course removed from cart");
    window.location.reload();
  };

  const handleCheckout = async () => {
    if (lessons.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);

    for (let i = 0; i < lessons.length; i++) {
      try {
        await payLesson(lessons[i]._id).then((res) => {
          if (i === lessons.length - 1) {
            window.location.href = res?.paymentUrl;
          }
        });

        localStorage.removeItem("cart");
      } catch (err) {
        console.error("Error in lesson", lessons[i]._id, err);
      }
    }

    setLoading(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[90vh] w-full">
        <Loader2 className="animate-spin size-20 mx-auto mt-10" />
      </div>
    );
  return (
    <div className="w-full px-4 py-5">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <div className="flex gap-4 max-md:flex-col">
          <div className="md:w-3/4">
            <p className="text-muted-foreground my-3">
              {lessons.length} Course in cart
            </p>
            {lessons.length === 0 ? (
              <p className="text-muted-foreground text-3xl">
                Your cart is empty
              </p>
            ) : (
              lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  onClick={()=>Navigate(`/lessons/${lesson._id}`)}
                  className="cursor-pointer hover:shadow-xl transition-shadow flex items-start justify-between border shadow-md mb-4 gap-8 rounded-xl p-4 relative"
                >
                  <div className="flex items-start justify-start gap-4 max-md:flex-col">
                    <img
                      src={image}
                      alt="Course Thumbnail"
                      className="h-30 object-cover rounded-md"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">{lesson.title}</h2>
                      <p className="text-muted-foreground">by John Doe</p>
                      <div>
                        <Rating stars={4} />{" "}
                        <span className="text-muted-foreground">
                          {lesson?.scheduledDate?.slice(0, 10)}.{" "}
                          {lesson.classLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold">${lesson.price}</h1>
                  <div
                    onClick={() => handleRemoveFromCart(lesson._id)}
                    className="absolute bottom-3 right-3 cursor-pointer bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-colors"
                  >
                    <Trash />
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="md:w-1/4">
            <h1 className="text-2xl font-bold">Order Details</h1>
            <div className=" border shadow-md rounded-xl p-4">
              {orderDetails.map((item) => (
                <p
                  key={item.name}
                  className={`flex items-center justify-between my-3 ${
                    item.name === "Total" ? "border-t pt-3" : ""
                  }`}
                >
                  <span
                    className={` ${
                      item.name === "Total"
                        ? "font-bold text-xl"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.name}:
                  </span>
                  <span className="text-lg font-bold">{item.value}</span>
                </p>
              ))}
            </div>
            <Button className="w-full mt-4" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
