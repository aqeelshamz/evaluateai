import 'package:evaluateai/providers/shop.dart';
import 'package:evaluateai/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class ShopScreen extends StatefulWidget {
  const ShopScreen({super.key});

  @override
  State<ShopScreen> createState() => _ShopScreenState();
}

class _ShopScreenState extends State<ShopScreen> {
  @override
  void initState() {
    Provider.of<ShopProvider>(context, listen: false).getShopItems();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.all(20),
        width: Get.width,
        height: Get.height,
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  IconButton(
                    padding: EdgeInsets.zero,
                    icon: const Icon(FeatherIcons.arrowLeft),
                    onPressed: () {
                      Get.back();
                    },
                  ),
                  Icon(FeatherIcons.shoppingCart),
                  const SizedBox(width: 10),
                  Text(
                    "Shop",
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Expanded(
                child: ListView.builder(
                  itemCount:
                      Provider.of<ShopProvider>(context).shopItems.length,
                  itemBuilder: (context, index) {
                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.1),
                            spreadRadius: 1,
                            blurRadius: 3,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            Provider.of<ShopProvider>(context).shopItems[index]
                                ['title'],
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 5),
                          Text(
                            currencySymbol +
                                Provider.of<ShopProvider>(context)
                                    .shopItems[index]['price']
                                    .toString(),
                            style: const TextStyle(
                              fontSize: 25,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Row(children: [
                            Icon(FeatherIcons.settings, size: 20),
                            const SizedBox(width: 10),
                            Text(
                              Provider.of<ShopProvider>(context)
                                      .shopItems[index]['evaluatorLimit']
                                      .toString() +
                                  " Evaluators",
                              style: const TextStyle(
                                fontSize: 16,
                              ),
                            ),
                          ]),
                          const SizedBox(height: 10),
                          Row(children: [
                            Icon(FeatherIcons.settings, size: 20),
                            const SizedBox(width: 10),
                            Text(
                              Provider.of<ShopProvider>(context)
                                      .shopItems[index]['evaluationLimit']
                                      .toString() +
                                  " Evaluations",
                              style: const TextStyle(
                                fontSize: 16,
                              ),
                            ),
                          ]),
                          const SizedBox(height: 20),
                          ElevatedButton(
                            onPressed: () {
                              //show dialog with payment methods
                              showDialog(
                                context: context,
                                builder: (context) {
                                  return AlertDialog(
                                    title: const Text("Select Payment Method"),
                                    content: Column(
                                      mainAxisSize: MainAxisSize.min,
                                      children: getPaymentMethods(
                                          Provider.of<ShopProvider>(context)
                                              .shopItems[index]['_id']),
                                    ),
                                  );
                                },
                              );
                            },
                            child: Text("Buy"),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> getPaymentMethods(String itemId) {
    List<Widget> paymentMethods = [];

    var provider = Provider.of<ShopProvider>(context, listen: false);

    for (var paymentMethod in provider.paymentMethods.keys.toList()) {
      paymentMethods.add(
        ListTile(
          leading: Icon(FeatherIcons.creditCard),
          title: Text(GetUtils.capitalize(paymentMethod)!),
          onTap: () {
            if (paymentMethod == "stripe") {
              Get.back();
              provider.initStripePayment(itemId);
            } else if (paymentMethod == "razorpay") {
              Get.back();
              provider.initRazorpayPayment(itemId);
            } else if (paymentMethod == "paypal") {
              Get.back();
              provider.initPaypalPayment(itemId);
            }
          },
        ),
      );
    }

    return paymentMethods;
  }
}
