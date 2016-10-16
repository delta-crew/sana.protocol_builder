Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/trusty64"
  config.vm.hostname = "sana-protocol-builder"
  config.vm.network :forwarded_port, guest: 80, host: 4567

  config.librarian_chef.cheffile_dir = "chef"
  config.vm.provider "virtualbox" do |v|
    v.memory = 1536
    v.cpus = 2
  end

  config.vm.provision "chef_solo" do |chef|
    chef.encrypted_data_bag_secret_key_path = "chef/.chef/data_bag_key"
    chef.cookbooks_path = ["chef/cookbooks"]
    chef.data_bags_path = "chef/data_bags"
    chef.add_recipe "recipe[apt]"
    chef.add_recipe "recipe[build-essential]"
    chef.add_recipe "recipe[openssl]"
    chef.add_recipe "recipe[git]"
    chef.add_recipe "recipe[ssh_known_hosts]"
    chef.add_recipe "recipe[postgres_password]"
    chef.add_recipe "recipe[postgresql::client]"
    chef.add_recipe "recipe[postgresql::server]"
    chef.add_recipe "recipe[redisio]"
    chef.add_recipe "recipe[redisio::enable]"
    chef.add_recipe "recipe[nginx]"
    chef.add_recipe "recipe[python]"
    chef.add_recipe "recipe[supervisor]"
    chef.add_recipe "recipe[line]"
    chef.add_recipe "recipe[nodejs]"
    chef.add_recipe "recipe[grunt_cookbook]"
    chef.add_recipe "recipe[virtualenvwrapper]"
    chef.add_recipe "recipe[sana-protocol-builder]"

    chef.json = {
      "nodejs" => {
        "install_method" => "binary",
        "binary" => {
          "checksum" => "1880f3421da5579678803a523c314b345f5db00799b51b7fd9484a3248efc068"
        },
        "version" => "5.4.1"
      },
      "build_essential" => {
        "compile_time" => true
      },
      "nginx" => {
        "default_site_enabled" => false
      },
      "sana_protocol_builder" => {
        "debug" => "true",
        "api_base" => "http://localhost:4567",
        "ssl" => false,
        "branch" => "untested_changes",
      }
    }
  end

end
