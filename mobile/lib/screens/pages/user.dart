import 'package:evaluateai/providers/evaluators.dart';
import 'package:evaluateai/screens/purchases.dart';
import 'package:evaluateai/screens/shop.dart';
import 'package:evaluateai/screens/splash.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserPage extends StatefulWidget {
  const UserPage({super.key});

  @override
  State<UserPage> createState() => _UserPageState();
}

class _UserPageState extends State<UserPage> {
  @override
  Widget build(BuildContext context) {
    var provider = Provider.of<EvaluatorsProvider>(context, listen: true);

    return Container(
      width: Get.width,
      height: Get.height,
      child: Column(
        children: [
          const SizedBox(height: 20),
          CircleAvatar(
            radius: 50,
            child: Icon(FeatherIcons.user),
          ),
          const SizedBox(height: 10),
          Text(
            provider.user['name'],
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          //ListTiles for Shop, My Purchases, and Logout
          Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  ListTile(
                    leading: Icon(FeatherIcons.shoppingCart),
                    title: const Text('Shop'),
                    onTap: () {
                      Get.to(() => const ShopScreen());
                    },
                  ),
                  ListTile(
                    leading: Icon(FeatherIcons.shoppingBag),
                    title: const Text('My Purchases'),
                    onTap: () {
                      Get.to(() => const PurchasesScreen());
                    },
                  ),
                  ListTile(
                    textColor: Colors.red,
                    iconColor: Colors.red,
                    leading: Icon(FeatherIcons.logOut),
                    title: const Text('Logout'),
                    onTap: () async {
                      showDialog(
                        context: context,
                        builder: (context) {
                          return AlertDialog(
                            title: const Text('Logout'),
                            content:
                                const Text('Are you sure you want to logout?'),
                            actions: [
                              TextButton(
                                onPressed: () {
                                  Navigator.pop(context);
                                },
                                child: const Text('Cancel'),
                              ),
                              TextButton(
                                onPressed: () async {
                                  SharedPreferences prefs =
                                      await SharedPreferences.getInstance();
                                  prefs.clear();
                                  Get.offAll(() => SplashScreen());
                                },
                                child: const Text(
                                  'Logout',
                                  style: TextStyle(color: Colors.red),
                                ),
                              ),
                            ],
                          );
                        },
                      );
                    },
                  ),
                ],
              )),
        ],
      ),
    );
  }
}
