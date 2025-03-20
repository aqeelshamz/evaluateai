import 'dart:convert';

import 'package:evaluateai/utils/api.dart';
import 'package:flutter/material.dart';

class ShopProvider extends ChangeNotifier {
  bool loading = false;
  List shopItems = [];
  List purchases = [];
  String paymentMethod = "";

  Future<void> getShopItems() async {
    loading = true;

    var response = await Server.get("/shop");

    if (response.statusCode == 200) {
      loading = false;

      shopItems = jsonDecode(response.body)["shopItems"];
      paymentMethod = jsonDecode(response.body)["paymentMethod"];
      notifyListeners();
    }
  }

  Future<void> getPurchases() async {
    loading = true;

    var response = await Server.get("/shop/purchases");

    if (response.statusCode == 200) {
      loading = false;

      purchases = jsonDecode(response.body);
      notifyListeners();
    }
  }
}
