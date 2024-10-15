import 'dart:convert';

import 'package:evaluateai/utils/api.dart';
import 'package:evaluateai/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:get/get.dart';

class ShopProvider extends ChangeNotifier {
  List<dynamic> purchases = [];
  List<dynamic> shopItems = [];
  Map paymentMethods = {};

  Future<void> getPurchases() async {
    var response = await Server.get("/shop/purchases");
    print(response.body);

    if (response.statusCode == 200) {
      purchases = jsonDecode(response.body);
      notifyListeners();
    }
  }

  Future<void> getShopItems() async {
    var response = await Server.get("/shop");
    print(response.body);

    if (response.statusCode == 200) {
      shopItems = jsonDecode(response.body)["items"];
      paymentMethods = jsonDecode(response.body)["paymentMethods"];
      notifyListeners();
    }
  }

  Future<void> initStripePaymentSheet(String itemId) async {
    var response =
        await Server.post("/shop/create-order-stripe", {"itemId": itemId});

    var data = jsonDecode(response.body);

    Stripe.publishableKey = stripePublishableKey;
    await Stripe.instance.initPaymentSheet(
        paymentSheetParameters: SetupPaymentSheetParameters(
      paymentIntentClientSecret: data["clientSecret"],
      applePay: PaymentSheetApplePay(
        merchantCountryCode: countryCode,
      ),
      googlePay: PaymentSheetGooglePay(
        merchantCountryCode: countryCode,
      ),
      style: ThemeMode.light,
      merchantDisplayName: appName,
    ));

    try {
      await Stripe.instance.presentPaymentSheet();
      await Server.post(
          "/shop/verify-stripe-payment", {"orderId": data["orderId"]});
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Payment successful!"),
        backgroundColor: Colors.green,
      ));
    } catch (e) {
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Payment failed!"),
        backgroundColor: Colors.red,
      ));
    }
  }
}
