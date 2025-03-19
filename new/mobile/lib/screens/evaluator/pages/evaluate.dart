import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';

class EvaluatePage extends StatefulWidget {
  const EvaluatePage({super.key});

  @override
  State<EvaluatePage> createState() => _EvaluatePageState();
}

class _EvaluatePageState extends State<EvaluatePage> {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: ListView(
        children: [
          Text("Extra prompt (optional)"),
          const SizedBox(height: 10),
          TextField(
            decoration: InputDecoration(
                hintText: "Prompt",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(15),
                )),
            maxLines: 4,
          ),
          const SizedBox(height: 20),
          Text("Total Marks"),
          const SizedBox(height: 10),
          TextField(
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              hintText: "Total Marks",
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
          ),
          const SizedBox(height: 20),
          TextButton.icon(
            onPressed: () {},
            style: TextButton.styleFrom(
              padding: EdgeInsets.symmetric(vertical: 15),
              backgroundColor: primaryColor,
              foregroundColor: Colors.white,
            ),
            icon: Icon(FeatherIcons.play),
            label: Text("Evaluate"),
          ),
          const SizedBox(height: 10),
          Center(child: Text("0 evaluations left.")),
        ],
      ),
    );
  }
}
