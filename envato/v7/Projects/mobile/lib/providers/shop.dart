import 'dart:convert';

import 'package:evaluateai/utils/api.dart';
import 'package:evaluateai/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_paypal/flutter_paypal.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:get/get.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';

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

  Future<void> initStripePayment(String itemId) async {
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

  Future<void> initRazorpayPayment(String itemId) async {
    var response =
        await Server.post("/shop/create-order-razorpay", {"itemId": itemId});

    var orderData = jsonDecode(response.body);

    print("Order data");
    print(orderData);

    Razorpay razorpay = Razorpay();

    razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, (data) async {
      PaymentSuccessResponse response = data;
      await Server.post("/shop/verify-razorpay-payment", {
        "razorpay_order_id": response.orderId,
        "transactionid": response.paymentId,
        "razorpay_signature": response.signature,
        "transactionamount": orderData["amount"],
      });

      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Payment successful!"),
        backgroundColor: Colors.green,
      ));
    });

    razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, (data) {
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Payment failed!"),
        backgroundColor: Colors.red,
      ));
    });

    razorpay.open(orderData);
  }

  Future<void> initPaypalPayment(String itemId) async {
    var response =
        await Server.post("/shop/create-order-paypal", {"itemId": itemId});

    var orderData = jsonDecode(response.body);

    Navigator.of(Get.context!).push(
      MaterialPageRoute(
        builder: (BuildContext context) => UsePaypal(
            sandboxMode: paypalSandboxMode,
            clientId: paypalClientId,
            secretKey: paypalClientSecret,
            returnURL: "https://samplesite.com/return",
            cancelURL: "https://samplesite.com/cancel",
            transactions: [
              {
                "amount": {
                  "total": orderData["newOrder"]["amount"],
                  "currency": paypalCurrency,
                  "details": {
                    "subtotal": orderData["newOrder"]["amount"],
                    "shipping": '0',
                    "shipping_discount": 0
                  }
                },
              }
            ],
            note: "Contact us for any questions on your order.",
            onSuccess: (Map params) async {
              print("onSuccess: $params");
              await Server.post("/shop/verify-paypal-payment", {
                "orderId": orderData["id"],
              });

              ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
                content: Text("Payment successful!"),
                backgroundColor: Colors.green,
              ));
            },
            onError: (error) {
              print("onError: $error");

              ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
                content: Text("Payment failed!"),
                backgroundColor: Colors.red,
              ));
            },
            onCancel: (params) {
              print('cancelled: $params');
            }),
      ),
    );
  }
}
