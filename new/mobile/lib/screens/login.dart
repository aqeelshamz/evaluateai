import 'package:evaluateai/screens/pages/classes/classes.dart';
import 'package:evaluateai/screens/pages/classes/new_edit_class.dart';
import 'package:evaluateai/screens/pages/evaluators/evaluators.dart';
import 'package:evaluateai/screens/pages/evaluators/new_edit_evaluator.dart';
import 'package:evaluateai/screens/pages/profile/profile.dart';
import 'package:evaluateai/screens/pages/shop/purchases.dart';
import 'package:evaluateai/screens/pages/shop/shop.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Container(
          padding: EdgeInsets.all(20),
          width: Get.width,
          height: Get.height,
          child: Column(
            children: [
              TextField(
                decoration: InputDecoration(
                    hintText: "Title",
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(15),
                    )),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
