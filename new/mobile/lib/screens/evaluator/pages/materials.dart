import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';

class MaterialsPage extends StatefulWidget {
  const MaterialsPage({super.key});

  @override
  State<MaterialsPage> createState() => _MaterialsPageState();
}

class _MaterialsPageState extends State<MaterialsPage> {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: ListView(
        children: [
          Row(
            children: [
              Icon(FeatherIcons.fileText),
              const SizedBox(width: 10),
              Text(
                "Question Paper",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            "Upload question paper for the evaluator. You can upload multiple files.",
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 20),
          TextButton(
            onPressed: () {},
            style: TextButton.styleFrom(
              padding: EdgeInsets.symmetric(vertical: 15),
              backgroundColor: primaryColor,
              foregroundColor: Colors.white,
            ),
            child: Text("Choose File(s)"),
          ),
          const SizedBox(height: 40),
          Row(
            children: [
              Icon(FeatherIcons.fileText),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  "Answer Keys / Answering Criteria",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            "Upload answer keys / answering criteria for the evaluator. You can upload multiple files.",
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 20),
          TextButton(
            onPressed: () {},
            style: TextButton.styleFrom(
              padding: EdgeInsets.symmetric(vertical: 15),
              backgroundColor: primaryColor,
              foregroundColor: Colors.white,
            ),
            child: Text("Choose File(s)"),
          ),
        ],
      ),
    );
  }
}
