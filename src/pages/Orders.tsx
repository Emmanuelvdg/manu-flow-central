
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { OrdersList } from "@/components/dashboard/OrdersList";

const Orders = () => {
  return (
    <MainLayout title="Orders">
      <OrdersList />
    </MainLayout>
  );
};

export default Orders;
