import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';

class AnswerSheetsPage extends StatefulWidget {
  const AnswerSheetsPage({super.key});

  @override
  State<AnswerSheetsPage> createState() => _AnswerSheetsPageState();
}

class _AnswerSheetsPageState extends State<AnswerSheetsPage> {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: ListView.builder(
        itemCount: 10,
        itemBuilder: (BuildContext context, int index) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "${index + 1}. Aqeel",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: () {},
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: 15),
                        backgroundColor: primaryColor,
                        foregroundColor: Colors.white,
                      ),
                      child: Text("Choose File(s)"),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 30),
            ],
          );
        },
      ),
    );
  }
}
