import 'package:evaluateai/providers/evaluators.dart';
import 'package:evaluateai/screens/evaluator.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class EvaluatorsPage extends StatefulWidget {
  const EvaluatorsPage({super.key});

  @override
  State<EvaluatorsPage> createState() => _EvaluatorsPageState();
}

class _EvaluatorsPageState extends State<EvaluatorsPage> {
  @override
  void initState() {
    Provider.of<EvaluatorsProvider>(context, listen: false).getEvaluators();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var provider = Provider.of<EvaluatorsProvider>(context, listen: true);

    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(FeatherIcons.fileText),
              const SizedBox(width: 10),
              Text(
                'Evaluators (${provider.evaluators.length})',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Consumer<EvaluatorsProvider>(
            builder: (context, provider, child) {
              return Expanded(
                child: RefreshIndicator(
                  onRefresh: () async {
                    await provider.getEvaluators();
                  },
                  child: ListView.builder(
                    itemCount: provider.evaluators.length,
                    itemBuilder: (context, index) {
                      return ListTile(
                        title: Text(provider.evaluators[index]['title']),
                        contentPadding: EdgeInsets.zero,
                        leading: Icon(FeatherIcons.fileText),
                        onTap: () {
                          Get.to(() => EvaluatorScreen(
                                evaluator: provider.evaluators[index],
                              ));
                        },
                      );
                    },
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
