import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { CartItem } from "~/models/CartItem";

export function useCart() {
  return useQuery<CartItem[], AxiosError>("cart", async () => {
    const res = await axios.get<CartItem[]>(`${API_PATHS.cart}/cart`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    });
    console.log('res', res)
    // @ts-ignore
    return res.data.data.cart.items;
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation((values: CartItem) =>
    axios.put<CartItem[]>(`${API_PATHS.cart}/cart`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}
