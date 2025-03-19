import 'package:evaluateai/providers/shop.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:evaluateai/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class PurchasesPage extends StatefulWidget {
  const PurchasesPage({super.key});

  @override
  State<PurchasesPage> createState() => _PurchasesPageState();
}

class _PurchasesPageState extends State<PurchasesPage> {
  @override
  void initState() {
    Provider.of<ShopProvider>(Get.context!, listen: false).getPurchases();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var shopProvider = Provider.of<ShopProvider>(context, listen: true);

    return Scaffold(
      body: SafeArea(
        child: Container(
          width: Get.width,
          height: Get.height,
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  GetPlatform.isIOS
                      ? IconButton(
                          onPressed: () {
                            Get.back();
                          },
                          icon: Icon(FeatherIcons.arrowLeft),
                        )
                      : const SizedBox.shrink(),
                  Icon(FeatherIcons.shoppingCart),
                  const SizedBox(width: 10),
                  Text(
                    "My Purchases",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Expanded(
                child: ListView.builder(
                  itemCount: shopProvider.purchases.length,
                  itemBuilder: (context, index) {
                    return Container(
                      padding: EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: Colors.grey.withAlpha(50),
                          width: 4,
                        ),
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Date",
                          ),
                          Text(
                            shopProvider.purchases[index]["createdAt"]
                                .split("T")[0],
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 20),
                          Text(
                            "Shop Item",
                          ),
                          Text(
                            shopProvider.purchases[index]["shopItem"]["title"],
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Container(
                            margin: EdgeInsets.symmetric(vertical: 5),
                            padding: EdgeInsets.symmetric(
                                vertical: 5, horizontal: 15),
                            decoration: BoxDecoration(
                              color: primaryColor.withAlpha(30),
                              borderRadius: BorderRadius.circular(50),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  FeatherIcons.play,
                                  size: 18,
                                  color: primaryColor,
                                ),
                                SizedBox(
                                  width: 10,
                                ),
                                Text(
                                  "Evaluators: ${shopProvider.purchases[index]["shopItem"]["evaluatorLimit"]}",
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: primaryColor,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            margin: EdgeInsets.symmetric(vertical: 5),
                            padding: EdgeInsets.symmetric(
                                vertical: 5, horizontal: 15),
                            decoration: BoxDecoration(
                              color: primaryColor.withAlpha(30),
                              borderRadius: BorderRadius.circular(50),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  FeatherIcons.edit,
                                  size: 18,
                                  color: primaryColor,
                                ),
                                SizedBox(
                                  width: 10,
                                ),
                                Text(
                                  "Evaluations: ${shopProvider.purchases[index]["shopItem"]["evaluationLimit"]}",
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: primaryColor,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            margin: EdgeInsets.symmetric(vertical: 5),
                            padding: EdgeInsets.symmetric(
                                vertical: 5, horizontal: 15),
                            decoration: BoxDecoration(
                              color: primaryColor.withAlpha(30),
                              borderRadius: BorderRadius.circular(50),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  FeatherIcons.users,
                                  size: 18,
                                  color: primaryColor,
                                ),
                                SizedBox(
                                  width: 10,
                                ),
                                Text(
                                  "Classes: ${shopProvider.purchases[index]["shopItem"]["classesLimit"]}",
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: primaryColor,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            "Amount",
                          ),
                          Text(
                            "$currencySymbol ${shopProvider.purchases[index]["amount"]}",
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
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
}
